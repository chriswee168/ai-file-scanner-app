import torch.nn as nn
from torch import Tensor

class FeedForward(nn.Module):
    """
    Contains two linear layers with an activation layer in between,
    typically used in the implementation of the attention mechanism introduced in
    the paper "Attention is All You Need" (Vaswani et al., 2017)
    Link to paper: https://arxiv.org/abs/1706.03762
    """
    def __init__(self, embedding_dim: int, hidden_dim: int) -> None:
        super().__init__()

        self.linear0 = nn.Linear(embedding_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.linear1 = nn.Linear(hidden_dim, embedding_dim)
        self.output_norm = nn.LayerNorm(embedding_dim)

    def forward(self, embeddings: Tensor) -> Tensor:
        
        # Project embedding vectors to hidden dimension.
        embeddings1 = self.linear0(embeddings)

        # Apply activation.
        embeddings1 = self.relu(embeddings1)

        # Project back to original embedding len.
        embeddings1 = self.linear1(embeddings1)

        # Residual connection to original embeddings.
        embeddings = embeddings + embeddings1

        # Layer normalize.
        embeddings = self.output_norm(embeddings)

        return embeddings