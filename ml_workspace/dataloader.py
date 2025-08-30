import os
import torch
from torch import Tensor
import numpy as np

def load_byte_data(
    dir_path: str, chunk_size: int, stride: int, 
    max_samples_per_class: int) -> tuple[Tensor, Tensor]:

    # Contains the number of training examples for each class.
    chunk_list: list[np.ndarray] = []
    class_list: list[int] = []
    
    # Expects folder structure:
    # dir_path/
    #   class_folder1/
    #       binary_file1
    #       binary_file2
    #        ...
    #   class_folder2/
    #   ...
    for c, folder in enumerate(os.listdir(dir_path)):
        classpath = os.path.join(dir_path, folder)

        class_count = 0

        for file in os.listdir(classpath):
            # Get full byte sequence of file as uint8.
            filepath = os.path.join(classpath, file)
            with open(filepath, "rb") as f:
                file_bytes = f.read()
            full_byte_seq = np.frombuffer(file_bytes, dtype=np.uint8)

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
                        chunk_list.append(byte_seq_chunk)
                        class_list.append(c)
                        
                        chunk_counter += 1
                        class_count += 1

                        print(f"\r{file}: {chunk_counter}/{chunk_count}", end="")
            
            if class_count < max_samples_per_class:
                print("\n", end="")
    
    print("\nRemoving any duplicate token chunks...")
    print(f"Current dataset size: {len(chunk_list)}")
    
    # Remove duplicate chunks to avoid bias during training.
    chunk_list = np.stack(chunk_list, axis=0)
    class_list = torch.LongTensor(class_list)
    
    _, idxs = np.unique(chunk_list, axis=0, return_index=True)
    sorted_idxs = np.sort(idxs)
    
    byte_chunks = torch.LongTensor(chunk_list[sorted_idxs])
    classes = class_list[sorted_idxs]
    
    print("Duplicate token chunks removed.")
    print(f"Current dataset size: {len(byte_chunks)}")
    
    return byte_chunks, classes