import torch
import torch.nn as nn
from torch import Tensor
import numpy as np
from ml_workspace.custom_torch_funcs.gen_rand_tensor_param import gen_rand_tensor_param

class SinusoidalPosEncoding(nn.Module):
    """
    Implementation of sinusoidal positional encoding introduced in 
    the paper "Attention is All You Need" (Vaswani et al., 2017)
    Link to paper: https://arxiv.org/abs/1706.03762
    """
    def __init__(self, shape: tuple, n: int) -> None:
        super().__init__()

        encoding_weights = np.zeros(shape=shape)
        for i in range(shape[1]):
            for j in range(0, shape[2], 2):
                denominator = n**((2 * j) / shape[2])
                encoding_weights[0][i][j] = np.sin(i / denominator)
                if j + 1 < shape[1]:
                    encoding_weights[0][i][j + 1] = np.cos(i / denominator)

        self.encoding_vectors = nn.Parameter(
            torch.FloatTensor(encoding_weights), 
            requires_grad=False
        )
    
    def forward(self, tensor: Tensor) -> Tensor:
        seq_len = tensor.shape[1]
        tensor = tensor + self.encoding_vectors[:, :seq_len, :]
        return tensor
    
    def extra_repr(self):
        return f"{tuple(self.encoding_vectors.shape)}"

class LearnablePosEncoding(nn.Module):
    """
    Positional encoding matrix with learnable weights.
    """
    def __init__(self, shape: tuple, lower: int, upper: int) -> None:
        super().__init__()

        self.encoding_vectors = gen_rand_tensor_param(
            shape=shape,
            lower=lower,
            upper=upper
        )
    
    def forward(self, tensor: Tensor) -> Tensor:
        seq_len = tensor.shape[1]
        tensor = tensor + self.encoding_vectors[:, :seq_len, :]
        return tensor
    
    def extra_repr(self):
        return f"{tuple(self.encoding_vectors.shape)}"