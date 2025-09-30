import os
import torch
import random
from torch import Tensor

def create_byte_dataset(
    dir_path: str, tensor_dataset_path: str, chunk_size: int, stride: int, 
    max_samples_per_class: int, max_shard_size: int) -> list[tuple[Tensor, Tensor]]:

    # Create the tensor dataset inputs and outputs directories.
    input_dir = os.path.join(tensor_dataset_path, "inputs")
    output_dir = os.path.join(tensor_dataset_path, "outputs")
    if not os.path.exists(input_dir):
        os.makedirs(input_dir)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # The directory names in dataset.
    classes = ["clean", "malicious"]

    # Get list of all file paths and their categories.
    all_file_class_tuples: list[tuple[str, int]] = []
    for c, cat in enumerate(classes):
        classpath = os.path.join(dir_path, cat)
        for root, _, files in os.walk(classpath):
            for file in files:
                all_file_class_tuples.append((os.path.join(root, file), c))
        
    # Buffer to hold tensors.
    input_shard: list[Tensor] = []
    output_shard: list[Tensor] = []

    # Counts for clean and malicious chunks.
    class_counts = [0, 0]

    # Shard count.
    shard_count = 0

    # Loop until no tuples left.
    while all_file_class_tuples:
        # Select random filepath and remove it.
        random_idx = random.randint(0, len(all_file_class_tuples) - 1)
        selected_tuple = all_file_class_tuples.pop(random_idx)
        filepath = selected_tuple[0]
        category = selected_tuple[1]

        with open(filepath, "rb") as f:
            file_bytes = f.read()
        full_byte_seq = torch.tensor(bytearray(file_bytes), dtype=torch.long)

        # Slice the byte sequences and add to chunk list.
        chunk_count = int(len(full_byte_seq) / stride)
        chunk_counter = 1
        for i in range(0, len(full_byte_seq), stride):

            # Continue only if class count exceeds max_samples_per_class
            if class_counts[category] < max_samples_per_class:
                byte_seq_chunk = full_byte_seq[i: i + chunk_size]

                # Only add chunks that are the same length of chunk size.
                # (Usually the last chunk is almost always shorter.)
                if len(byte_seq_chunk) == chunk_size:

                    # Check if shards have reached shard limit.
                    if len(input_shard) < max_shard_size:
                        input_shard.append(byte_seq_chunk)
                        output_shard.append(torch.FloatTensor([[category]]))
                    else:
                        # Convert shards into tensors and save.
                        input_tensor_shard = torch.stack(input_shard, dim=0)
                        output_tensor_shard = torch.stack(output_shard, dim=0)

                        torch.save(input_tensor_shard, os.path.join(input_dir, f"{shard_count}.pt"))
                        torch.save(output_tensor_shard, os.path.join(output_dir, f"{shard_count}.pt"))
                        print(f"\n\033[32mSaved shard {shard_count} | {class_counts} | {len(all_file_class_tuples)}\033[0m")
                        shard_count += 1

                        # Clear shard buffers.
                        input_shard.clear()
                        output_shard.clear()
                        
                    chunk_counter += 1
                    class_counts[category] += 1

                    print(f"\r{filepath}: {chunk_counter}/{chunk_count}", end="")
            
        if class_counts[category] < max_samples_per_class:
            print("\n", end="")

    print(f"\nCurrent number of dataset shards: {shard_count}")