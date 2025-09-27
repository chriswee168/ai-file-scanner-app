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

    # Contains the number of training examples for each class.
    dataset: list[tuple[Tensor, Tensor]] = []
    
    # The directory names in dataset.
    classes = ["clean", "malicious"]

    # Get list of all file paths and their categories.
    all_file_class_tuples: list[tuple[str, int]] = []
    for c, cat in enumerate(classes):
        classpath = os.path.join(dir_path, cat)
        for root, _, files in os.walk(classpath):
            for file in files:
                all_file_class_tuples.append((os.path.join(root, file), c))

    for c, cat in enumerate(classes):
        classpath = os.path.join(dir_path, cat)

        class_count = 0

        for file in os.listdir(classpath):
            # Get full byte sequence of file as uint8.
            filepath = os.path.join(classpath, file)
            with open(filepath, "rb") as f:
                file_bytes = f.read()
            full_byte_seq = torch.tensor(bytearray(file_bytes), dtype=torch.long)

            # Slice the byte sequences and add to chunk list.
            chunk_count = int(len(full_byte_seq) / stride)
            chunk_counter = 1
            for i in range(0, len(full_byte_seq), stride):

                # Continue only if class count exceeds max_samples_per_class
                if class_count < max_samples_per_class:
                    byte_seq_chunk = full_byte_seq[i: i + chunk_size]

                    # Only add chunks that are the same length of chunk size.
                    # (Usually the last chunk is almost always shorter.)
                    if len(byte_seq_chunk) == chunk_size:
                        dataset.append(
                            (byte_seq_chunk, torch.FloatTensor([[c]]))
                        )
                        
                        chunk_counter += 1
                        class_count += 1

                        print(f"\r{file}: {chunk_counter}/{chunk_count}", end="")
            
            if class_count < max_samples_per_class:
                print("\n", end="")
    
    print(f"\nCurrent dataset size: {len(dataset)}")

    return dataset