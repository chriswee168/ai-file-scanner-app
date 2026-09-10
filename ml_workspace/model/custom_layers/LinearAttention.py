import torch
import torch.nn as nn
from torch import Tensor
from torch.nn.functional import scaled_dot_product_attention
from ml_workspace.model.custom_torch_funcs.head_ops import head_concat, head_partition

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
        context_len: int,
        dropout: float
    ) -> None:
        super().__init__()

        self.dropout = dropout
        self.heads = heads

        # Linear layer to generate K, Q and V embeddings simutaneously.        
        self.kqv = nn.Linear(embedding_len, heads * attn_len * 3, bias=False)

        # Low rank projection matrices.
        self.k_proj = nn.Linear(context_len, proj_len, bias=False)
        self.v_proj = nn.Linear(context_len, proj_len, bias=False)
        
        # Linear layer to process the concatenated attn_scores * V results.
        self.output = nn.Linear(heads * attn_len, embedding_len, bias=False)

        # Output layer normalization.
        self.output_layernorm = nn.LayerNorm(embedding_len)
    
    def forward(self, embeddings: Tensor) -> Tensor:
        # Generate K, Q and V embeddings.
        kqv = self.kqv(embeddings)

        # Parition K, Q and V embeddings from single matrix, and parition
        # each one for multi headed matrix multiplication.
        kqv = head_partition(kqv, 3)
        k_embeddings = head_partition(kqv[:, 0], self.heads)
        q_embeddings = head_partition(kqv[:, 1], self.heads)
        v_embeddings = head_partition(kqv[:, 2], self.heads)

        # Project K and V to low rank matrices.
        k_embeddings = torch.transpose(k_embeddings, -2, -1)
        v_embeddings = torch.transpose(v_embeddings, -2, -1)

        k_embeddings_low = self.k_proj(k_embeddings)
        v_embeddings_low = self.v_proj(v_embeddings)
        
        k_embeddings_low = torch.transpose(k_embeddings_low, -2, -1)
        v_embeddings_low = torch.transpose(v_embeddings_low, -2, -1)

        # Multi-headed attention.
        head_outputs = scaled_dot_product_attention(
            q_embeddings, k_embeddings_low, v_embeddings_low, 
            dropout_p=self.dropout, is_causal=False
        )

        # Concatenate head outputs and combine them via output layer.
        concatenated_heads = head_concat(head_outputs)
        output = self.output(concatenated_heads)

        # Add back to original embeddings as residual connection.
        embeddings = embeddings + output

        # Layer normalize the updated embeddings.
        embeddings = self.output_layernorm(embeddings)

        return embeddings