import torch
import torch.nn as nn
from torch import Tensor
from ml_workspace.custom_torch_funcs.head_ops import head_partition, head_concat

class MultiHeadGlobalConv(nn.Module):
    """
    Implementation of a custom multi-headed global convolutional architecture.
    """
    def __init__(
        self, 
        heads: int, 
        embedding_len: int, 
        latent_len: int, 
        kernels_per_head: int, 
        dropout: float
    ) -> None:

        super().__init__()

        self.heads = heads
        self.embedding_len = embedding_len
        self.latent_len = latent_len
        self.kernels_per_head = kernels_per_head

        # Generating latent embedding based on inputs.
        self.gen_latent_embeddings = nn.Linear(embedding_len, heads * latent_len, bias=False)

        # Implementation of the FeedForward architecture.
        self.linear0 = nn.Linear(embedding_len, embedding_len * 4, bias=False)
        self.gelu = nn.GELU()
        self.linear1 = nn.Linear(embedding_len * 4, heads * latent_len, bias=False)

        # Dropout layers.
        self.latent_embeddings_dropout = nn.Dropout(dropout)
        self.projected_embeddings_dropout = nn.Dropout(dropout)
        
        # Layer to generate dynamically sized global kernels based on positional encodings.
        self.gen_dyn_kernels = nn.Linear(embedding_len, heads * kernels_per_head * latent_len, bias=False)

        # Layer normalization to control scaling.
        self.context_vec_layernorm = nn.LayerNorm(latent_len)

        # Final linear layer to project concatenated head outputs to embedding length.
        self.output = nn.Linear(heads * kernels_per_head, embedding_len, bias=False)

        # Layer normalization for updated embeddings.
        self.output_norm = nn.LayerNorm(embedding_len)

    def forward(self, embeddings: Tensor, pos_encodings: Tensor) -> Tensor:

        # Generating latent embeddings and secondary embedding projections.
        latent_embeddings = self.gen_latent_embeddings(embeddings)
        latent_embeddings = self.latent_embeddings_dropout(latent_embeddings)

        # Apply GELU activation to projected embeddings and pass them
        # through linear layer.
        projected_embeddings = self.linear0(embeddings)
        projected_embeddings = self.gelu(projected_embeddings)
        projected_embeddings = self.linear1(projected_embeddings)
        projected_embeddings = self.projected_embeddings_dropout(projected_embeddings)

        # Reshape the latent embeddings and projected embeddings to split across heads.
        latent_embeddings = head_partition(latent_embeddings, self.heads)
        projected_embeddings = head_partition(projected_embeddings, self.heads)

        # Insert extra dimension for broadcast multiplication compatibility with kernels.
        latent_embeddings = torch.unsqueeze(latent_embeddings, dim=2)

        # Generate dynamic kernels from positional encodings.
        dyn_kernel = self.gen_dyn_kernels(pos_encodings)

        # Partition, reshape and transpose dynamic kernel for shape compatibility with
        # latent embeddings.
        dyn_kernel = head_partition(dyn_kernel, self.heads)
        dyn_kernel_shape = dyn_kernel.shape
        dyn_kernel = torch.reshape(dyn_kernel, (*dyn_kernel_shape[:3], self.kernels_per_head, self.latent_len))
        dyn_kernel = torch.transpose(dyn_kernel, 2, 3)
        
        # Perform dot product between latent embeddings and dynamic kernel along 
        # fourth axis (embedding sequence).
        latent_embeddings = latent_embeddings * dyn_kernel
        context_vectors = torch.sum(latent_embeddings, dim=3)

        # Apply layer normalization to context vectors.
        context_vectors = self.context_vec_layernorm(context_vectors)

        # Transpose last two dimensions for matrix multiplication with projected embeddings.
        context_vectors = torch.transpose(context_vectors, -2, -1)
        
        # Integrate context vectors with the projected embeddings via matrix multiplication.
        contextual_projections = torch.matmul(projected_embeddings, context_vectors)
        
        # Concatenate head outputs into single 2D matrix to preserve information
        # across all heads.
        contextual_projections = head_concat(contextual_projections)

        # Pass concatenated head outputs through final linear layer to project
        # to embedding length, and add to original embeddings for contextual enrichment.
        output_embeddings = self.output(contextual_projections)

        # Sum the contextual embeddings along heads and add to the original 2D embeddings,
        # original embeddings are contextually enriched.
        embeddings = embeddings + output_embeddings
        
        # Perform layer normalization on updated embeddings.
        embeddings = self.output_norm(embeddings)

        return embeddings