import torch

def gen_rand_tensor_param(shape: tuple[int], lower: float, upper: float) -> torch.nn.Parameter:
    """
    Generate tensor parameters of custom shape and initialization range.
    """
    tensor = (upper - lower) * torch.rand(shape) + lower
    return torch.nn.Parameter(tensor, requires_grad=True)