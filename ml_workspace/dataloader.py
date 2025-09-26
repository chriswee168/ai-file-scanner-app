import os
import torch
from torch import Tensor

def create_byte_dataset(
    dir_path: str, output_dir: str, chunk_size: int, stride: int, 
    max_samples_per_class: int):
    
    # Create target directories to write to.
    if not os.path.exists(os.path.join(output_dir, "inputs")):
        os.makedirs(os.path.join(output_dir, "inputs"))
    
    if not os.path.exists(os.path.join(output_dir, "outputs")):
        os.makedirs(os.path.join(output_dir, "outputs"))

    # The directory names in dataset.
    classes = ["clean", "malicious"]

    dataset_size = 0

    for c, cat in enumerate(classes):
        classpath = os.path.join(dir_path, cat)

        class_count = 0

        for k, file in enumerate(os.listdir(classpath)):
            sub_dataset_x: list[Tensor] = []
            sub_dataset_y: list[Tensor] = []

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
                        sub_dataset_x.append(byte_seq_chunk)
                        sub_dataset_y.append(torch.FloatTensor([[c]]))
                        
                        chunk_counter += 1
                        class_count += 1

                        print(f"\r{file}: {chunk_counter}/{chunk_count}", end="")
            
            if class_count < max_samples_per_class:
                print("\n", end="")
            
            # If samples in sub dataset.
            if sub_dataset_x:

                # Remove duplicates.
                sub_dataset_x = torch.stack(sub_dataset_x, dim=0)
                sub_dataset_x_nodup = torch.unique(sub_dataset_x, dim=0)
                sub_dataset_y = torch.stack(sub_dataset_y, dim=0)
                sub_dataset_y = sub_dataset_y[:len(sub_dataset_x_nodup)]

                # Save x and y subset tensors to file.
                torch.save(sub_dataset_x_nodup, os.path.join(output_dir, "inputs", f"{k}.pt"))
                torch.save(sub_dataset_y, os.path.join(output_dir, "outputs", f"{k}.pt"))

                # Update full database size.
                dataset_size += len(sub_dataset_x_nodup)

    
    print(f"\nDataset size: {dataset_size}")