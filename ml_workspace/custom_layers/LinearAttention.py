import torch.nn as nn
from torch import Tensor
from torch.nn.functional import scaled_dot_product_attention


class LinearAttention(nn.Module):
    """
    Implementation of the linear self attention mechanism introduced in
    the paper "Linformer: Self-Attention with Linear Complexity" (Wang et al. 2020)
    Link to paper: https://arxiv.org/abs/2006.04768
    """
    def __init__(
        self, 
        heads: int, 
        embedding_len: int, 
        attn_len: int, 
        proj_len: int,
        dropout: float
    ) -> None:
        super().__init__()