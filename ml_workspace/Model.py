import torch.nn as nn
import json
from torch import Tensor
from ml_workspace.custom_layers.FeedForward import FeedForward
from ml_workspace.custom_layers.LinearAttention import LinearAttention
from ml_workspace.custom_layers.PositionalEncoding import LearnablePosEncoding, SinusoidalPosEncoding
from ml_workspace.custom_layers.MultiHeadGlobalConv import MultiHeadGlobalConv

# Main class for AI models.
class Model(nn.Module):
    def __init__(self, hyper_params_path: str, dropout: float):
        super().__init__()

        # Load the hyperparameter setting parameters from JSON.
        with open(hyper_params_path, "r") as f:
            hyper_params = json.load(f)

        heads: int = hyper_params["heads"]
        blocks: int = hyper_params["blocks"]
        embedding_len: int = hyper_params["embedding_len"]
        context_len: int = hyper_params["context_len"]
        attn_embedding_len: int = hyper_params["attn_embedding_len"]
        low_rank_proj: int = hyper_params["low_rank_proj"]
        pos_encoding_type: str = hyper_params["pos_encoding_type"]

        # Block types: "attention" or "global_conv".
        block_type: str = hyper_params["block_type"]

        include_ff_blocks: bool = hyper_params["include_ff_blocks"]
        kernels_per_head: int = hyper_params["kernels_per_head"]
        sinusoidal_n: int = hyper_params["sinusoidal_n"]

        mlp_dense_layer_dims: list[int] = hyper_params["mlp_dense_layer_dims"]

        # There are 256 bytes in total.
        vocab_size: int = 256
        self.embedding_layer = nn.Embedding(vocab_size, embedding_len)

        # Initialize positional encoding layer.
        if pos_encoding_type == "sinusoidal":
            self.pos_encoding = SinusoidalPosEncoding(
                shape=(1, context_len, embedding_len), 
                n=sinusoidal_n
            )
        elif pos_encoding_type == "learnable":
            self.pos_encoding = LearnablePosEncoding(
                shape=(1, context_len, embedding_len), 
                lower=-1 / embedding_len**0.5,
                upper=1 / embedding_len**0.5
            )
        else:
            print((f"Error: Positional encoding option \"{pos_encoding_type}\" "
                    f"not available (only \"sinusoidal\" or \"learnable\")."))
            raise SystemExit()
        
        # Module list to contain layer blocks.
        self.blocks = nn.ModuleList()

        # Module list for final dense classifier.
        self.mlp = nn.ModuleList()

        # Initialize blocks.
        for _ in range(blocks):
            if block_type == "attention":
                block = LinearAttention(
                    heads=heads,
                    embedding_len=embedding_len,
                    attn_len=attn_embedding_len,
                    proj_len=low_rank_proj,
                    context_len=context_len,
                    dropout=dropout
                )
            elif block_type == "global_conv":
                block = MultiHeadGlobalConv(
                    heads=heads,
                    embedding_len=embedding_len,
                    latent_len=attn_embedding_len,
                    kernels_per_head=kernels_per_head,
                    dropout=dropout
                )

            # Append the linear attention/multi headed global convolutional block.
            self.blocks.append(block)

            # Append feedforward layer.
            if include_ff_blocks:
                feedforward_layer = FeedForward(
                    embedding_dim=embedding_len,
                    hidden_dim=embedding_len * 4,
                    dropout=dropout
                )

                self.blocks.append(feedforward_layer)
        
        # Initialize the dense classification layers.
        current_dim = embedding_len
        for dim in mlp_dense_layer_dims:
            dense_layer = nn.Linear(current_dim, dim)
            activation_layer = nn.SiLU()
            dropout_layer = nn.Dropout(dropout)

            self.mlp.append(dense_layer)
            self.mlp.append(activation_layer)
            self.mlp.append(dropout_layer)

            current_dim = dim
        
        # Output layers.
        self.output_layer = nn.Linear(current_dim, 1)
        self.output_sigmoid = nn.Sigmoid()
    
    def forward(self, tokens: Tensor) -> Tensor:
        # Get embeddings.
        embeddings = self.embedding_layer(tokens)

        # Apply positional encodings.
        embeddings = self.pos_encoding(embeddings)

        # Obtain the positional encoding vectors.
        pos_encodings = self.pos_encoding.encoding_vectors.detach()

        # Pass embeddings through blocks.
        for layer in self.blocks:
            # Multi headed global convoluutional block requires positional
            # encodings for dynamic global kernel generation.
            if isinstance(layer, MultiHeadGlobalConv):
                embeddings = layer(embeddings, pos_encodings)
            else:
                embeddings = layer(embeddings)
        
        # Get CLS embedding vector for classification, first
        # token is assumed to be CLS.
        cls_embedding = embeddings[:, 0, :]

        # Pass CLS through dense classification layers.
        for layer in self.mlp:
            cls_embedding = layer(cls_embedding)
        
        # Obtain output classification.
        output = self.output_layer(cls_embedding)
        output = self.output_sigmoid(output)

        return output        