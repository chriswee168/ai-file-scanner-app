import torch.nn as nn
import json

# Main class for AI models.
class Model(nn.Module):
    def __init__(self, hyper_params_path: str):
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
        sinusoidal_n: int = hyper_params["sinusoidal_n"]

        mlp_dense_layer_dims: list[int] = hyper_params["mlp_dense_layer_dims"]

