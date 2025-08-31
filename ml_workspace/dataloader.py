import os
import torch
from torch import Tensor
import numpy as np
from copy import deepcopy

def load_byte_data(
    dir_path: str, chunk_size: int, stride: int, 
    max_samples_per_class: int) -> list[tuple[Tensor, Tensor]]:

    # Contains the number of training examples for each class.
    dataset: list[tuple[Tensor, Tensor]] = []
    
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
                            (byte_seq_chunk, torch.LongTensor([c]))
                        )
                        
                        chunk_counter += 1
                        class_count += 1

                        print(f"\r{file}: {chunk_counter}/{chunk_count}", end="")
            
            if class_count < max_samples_per_class:
                print("\n", end="")
    
    print(f"\nCurrent dataset size: {len(dataset)}")

    return dataset