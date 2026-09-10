from ml_workspace.data_preprocessing.create_byte_dataset import create_byte_dataset
from ml_workspace.model.Model import Model
import torch
import os
import time
import random

# Define paths for model weight files and dictionaries.
model_name = "model_attn_2048"
dataset_path = "ml_workspace/dataset/file_dataset/"
tensor_dataset_path = "ml_workspace/dataset/tensor_dataset/"
input_shard_paths = os.path.join(tensor_dataset_path, "inputs")
output_shard_paths = os.path.join(tensor_dataset_path, "outputs")
hyper_params_path = f"ml_workspace/model/models/{model_name}/hparams.json"
model_path = f"ml_workspace/model/models/{model_name}/weights.pt"

# Create the model directory if they doesn't exist already.
if not os.path.exists(os.path.join("ml_workspace/model/models", model_name)):
    os.makedirs(os.path.join("ml_workspace/model/models", model_name))

# Create the tensor dataset if it doesn't exist.
if not os.path.exists(tensor_dataset_path):
    create_byte_dataset(
        dir_path=dataset_path, 
        tensor_dataset_path=tensor_dataset_path,
        chunk_size=2048,
        stride=1000,
        max_samples_per_class=350000,
        max_shard_size=10000
    )

n_shards = len(os.listdir(input_shard_paths))

# Initialize language model object.
model = Model(
    hyper_params_path=hyper_params_path,
    dropout=0.2,
).cuda()

# Load weights from model_path.
#model.load_state_dict(torch.load(model_path))

total_params: int = 0
for name, param in model.named_parameters():
    #print(name, param)
    
    if param.requires_grad:
        total_params += len(torch.flatten(param))

print(model)
print("Total parameters:", total_params)

# Initialize settings for model training.
epochs = 100
optimizer = torch.optim.AdamW(model.parameters(), lr=0.00001, weight_decay=0.0)
criterion = torch.nn.BCELoss()
lowest_test_loss = None

stop_training = False

test_split_percent = 0.05

# Epoch loops.
for e in range(epochs):

    total_train_loss = 0.0
    total_test_loss = 0.0
    train_loss_vals = []

    # Train loop.
    model.train()

    # Generate list of shards indexes.
    all_shard_idxs = list(range(n_shards))

    # Record training time start.
    time_start = time.perf_counter()

    train_count = 0
    test_count = 0

    # Loop through all data shards.
    while all_shard_idxs:
        # Select random shard index without replacement.
        random_shard_idx = random.choice(all_shard_idxs)
        all_shard_idxs.remove(random_shard_idx)
        print(f"\nSelected data shard: {random_shard_idx} | {len(all_shard_idxs)} shards left")

        # Load the input/output data shards.
        input_shard = torch.load(os.path.join(input_shard_paths, f"{random_shard_idx}.pt"))
        output_shard = torch.load(os.path.join(output_shard_paths, f"{random_shard_idx}.pt"))

        partition_idx = int(len(input_shard) * (1 - test_split_percent))
        input_train_shard, input_test_shard = input_shard[:partition_idx], input_shard[partition_idx:]
        output_train_shard, output_test_shard = output_shard[:partition_idx], output_shard[partition_idx:]

        train_shard_len = len(input_train_shard)
        test_shard_len = len(input_test_shard)
        
        total_shard_train_loss = 0.0
        total_shard_test_loss = 0.0

        # Train loop.
        for i, (byte_chunk, output_class) in enumerate(zip(input_train_shard, output_train_shard), 1):
            
            byte_chunk = byte_chunk.cuda()
            output_class = output_class.cuda()

            # Add batch dimension.
            byte_chunk = byte_chunk.unsqueeze(0)
            
            # Forward propagation and obtain loss.
            pred = model(byte_chunk)

            # Transpose predictions for compatibility with CrossEntropy.
            loss = criterion(pred, output_class)
            
            # Backpropagate.
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_shard_train_loss += loss.item()
            total_train_loss += loss.item()
            train_count += 1

            train_loss_vals.append(loss.item())

            print(f"\r{i}/{len(input_train_shard)} | current_train_loss: {total_shard_train_loss / i}", end="")

        print("\n", end="")

        # Test loop.
        model.eval()
        for i, (byte_chunk, output_class) in enumerate(zip(input_test_shard, output_test_shard), 1):
            
            byte_chunk = byte_chunk.cuda()
            output_class = output_class.cuda()

            byte_chunk = byte_chunk.unsqueeze(0)

            # Inference and obtain loss.
            with torch.no_grad():
                pred = model(byte_chunk)            
                loss = criterion(pred, output_class)

                total_shard_test_loss += loss.item()
                total_test_loss += loss.item()
                test_count += 1

            print(f"\r{i}/{len(input_test_shard)} | current_test_loss: {total_shard_test_loss / i}", end="")
    
    # Record time training stopped.
    time_stop = time.perf_counter()

    # Calculate training and testing loss average.
    train_loss_ave = total_train_loss / train_count
    test_loss_ave = total_test_loss / test_count

    # Calculate loss variance.
    loss_variance = 0
    for val in train_loss_vals:
        loss_variance += (val - train_loss_ave)**2
    loss_variance /= len(train_loss_vals)

    print(f"\nEpoch: {e}")
    print(f"train_loss: \033[32m{train_loss_ave}\033[0m | test_loss: \033[33m{test_loss_ave}\033[0m | train_loss_var: \033[34m{loss_variance}\033[0m")
    print(f"training_time: {time_stop - time_start} secs")
        
    # Checkpoint model weights if lower testing loss reached.
    if lowest_test_loss is None or test_loss_ave < lowest_test_loss:
        lowest_test_loss = test_loss_ave
            
        torch.save(model.state_dict(), model_path)
        print("Saved model checkpoint to:", model_path)
        print("Lowest loss:\033[35m", lowest_test_loss, "\033[0m")