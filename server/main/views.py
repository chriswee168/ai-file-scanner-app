import os
import json
from time import ctime
from django.http import HttpRequest, JsonResponse, HttpResponse, StreamingHttpResponse
from django.shortcuts import render
import torch
from torch import Tensor

from ml_workspace.Model import Model
from server.main.models import AIModelsTable

# Create your views here.

# Index view to display the main page.
def index(request: HttpRequest):

    # Directory containing AI models.
    base_path = "./ml_workspace/models"

    # Used for checking which database entries to remove.
    existing_model_dirs: list[str] = []

    # Add new entries to the AI model database.
    for model_dir in os.listdir(base_path):
        existing_model_dirs.append(model_dir)
        model_path = os.path.join(base_path, model_dir)
        
        # Create AI model entry if it doesn't exist for the directory.
        entry_exists = AIModelsTable.objects.filter(model_name=model_dir).exists()
        if not entry_exists:
            AIModelsTable.objects.create(
                model_name=model_dir, 
                model_path=model_path
            )
            print(f"Created database entry {model_dir} -> {model_path}")
    
    # Remove entries associated with nonexistent AI model directories.
    for entry in AIModelsTable.objects.values("model_name", "model_path"):
        model_name = entry["model_name"]
        model_path = entry["model_path"]

        # If model directory in entry does not exist, remove entry.
        if model_name not in existing_model_dirs:
            AIModelsTable.objects.get(model_name=model_name).delete()
            print(f"Removed database entry {model_name} -> {model_path}")
            
    return render(
        request=request, 
        template_name="index.html", 
        context={"model_db": AIModelsTable.objects.all()}
    )

# View to return a list of filepaths for each file
# in a local path directory.
def get_filepaths(request: HttpRequest):

    if request.method == "POST":

        # List of filepaths to return.
        filepaths: list[str] = []
        metadatas: list[dict] = []

        # Search for every file in the specified path.
        path = json.loads(request.body)["dir_path"]
        for root, _, files in os.walk(path):
            for file in files:
                filepath = os.path.join(root, file)
                metadata = {
                    "name": os.path.basename(filepath),
                    "absolute_path": filepath,
                    "size": os.path.getsize(filepath),
                    "last_created": ctime(os.path.getctime(filepath)),
                    "last_accessed": ctime(os.path.getatime(filepath)),
                    "last_modified": ctime(os.path.getmtime(filepath))
                }                    
                filepaths.append(file)
                metadatas.append(metadata)
        
        json_data = {"filepaths": filepaths, "metadatas": metadatas}
    
        return JsonResponse(json_data)

# View to set the path of file and name of AI model selected
# by user before starting the byte chunk prediction process.
def prediction_conf(request: HttpRequest):
    if request.method == "POST":
        data = json.loads(request.body)
        request.session["file_path"] = data["filePath"]
        request.session["model_name"] = data["modelName"]

        return HttpResponse(status=200)

# View to predict the class that each byte chunk belongs
# to (clean, warning, malicious) and continuously send them
# to client.
def predict_chunks(request: HttpRequest):
    # Get selected file path and model name.
    file_path: str = request.session["file_path"]
    model_name: str = request.session["model_name"]

    # Query AI model database to get the path to model's weights.
    model_path = AIModelsTable.objects.get(model_name).model_path

    # Load the AI model.
    hyper_param_path = os.path.join(model_path, "hparams.json")
    weights_path = os.path.join(model_path, "weights.pt")
    model = load_model(hyper_param_path, weights_path)

    # Load file byte sequence.
    with open(file_path, "rb") as f:
        file_bytes = f.read()
    
    # Get chunk size (context length of model).
    chunk_size = int(model_name.split("_"))[-1]

    # Stride to slide chunk window across whole file byte sequence.
    stride = chunk_size

    # Start server side event stream.
    response = StreamingHttpResponse(
        stream_func(model, file_bytes, chunk_size, stride),
        content_type="text/event-stream"
    )

    response["Cache-Control"] = "no-cache"
    return response


# Function to load PyTorch model.
def load_model(hyper_param_path: str, weights_path: str) -> Model:
    
    # Initialize model.
    model = Model(
        hyper_params_path=hyper_param_path
    )

    # Load the weights.
    model.load_state_dict(torch.load(weights_path))

    return model

# Function to yield chunk prediction probability.
def stream_func(model: Model, file_bytes: bytes, chunk_size: int, stride: int):
    for i in range(0, len(file_bytes), stride):

        # Only consider chunks that are the same length as chunk_size.
        byte_chunk = file_bytes[i: i + chunk_size]
        if len(byte_chunk) == chunk_size:
            byte_chunk = torch.tensor(
                [bytearray(byte_chunk)], 
                dtype=torch.long
            )

            # Obtain model prediction of byte chunk.
            with torch.inference_mode():
                output_logits = model(byte_chunk)[0]
                    
                # Softmax the logits.
                output_softmaxed = torch.softmax(output_logits, dim=0)

                # Get classification of byte chunk.
                if output_softmaxed[0] < 0.25:
                    chunk_class = 0 # Clean.
                elif 0.25 <= output_softmaxed[1] and output_softmaxed[1] < 0.75:
                    chunk_class = 1 # Warning.
                elif output_softmaxed[1] >= 0.75:
                    chunk_class = 2 # Malicious.

                data = json.dumps({"chunkClass": chunk_class})

                # Send the chunk class predicted to client.
                yield f"data: {data}\n\n"
        
        else: # Chunk is smaller than chunk_size.
            pass
            
    # Finished scanning.
    print("Byte chunk scanning completed.")