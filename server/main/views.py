import os
import json
from time import ctime
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render

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
                    "size": os.path.getsize(filepath),
                    "last_created": ctime(os.path.getctime(filepath)),
                    "last_accessed": ctime(os.path.getatime(filepath)),
                    "last_modified": ctime(os.path.getmtime(filepath))
                }
                filepaths.append(filepath)
                metadatas.append(metadata)
        
        json_data = {"filepaths": filepaths, "metadatas": metadatas}
    
        return JsonResponse(json_data)