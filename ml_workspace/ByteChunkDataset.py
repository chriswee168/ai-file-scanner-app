from torch import Tensor
from torch.utils.data import Dataset

class ByteChunkDataset(Dataset):
    """
    Custom dataset class for containing input byte chunks and target classes.
    """
    def __init__(self, inputs: Tensor, outputs: Tensor) -> None:
        self.inputs = inputs
        self.outputs = outputs
    
    def __len__(self) -> int:
        return len(self.inputs)
    
    def __getitem__(self, index) -> tuple[Tensor, Tensor]:
        return self.inputs[index], self.outputs[index]