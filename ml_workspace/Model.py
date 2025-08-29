import torch.nn as nn
import json

# Main class for AI models.
class Model(nn.Module):
    def __init__(self, hyper_params_path: str):
        super().__init__()

