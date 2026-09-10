import torch

def head_partition(matrices: torch.Tensor, n_heads: int) -> torch.Tensor:
    """
    Partition across heads. (b, m, n * k) -> (b, n, m, k)
    """
    dim = matrices.shape

    tensor = torch.reshape(
        matrices, 
        shape=(dim[0], dim[1], n_heads, int(dim[2] / n_heads))
    )
    tensor = torch.transpose(tensor, 1, 2)

    return tensor

def head_concat(tensor: torch.Tensor) -> torch.Tensor:
    """
    Concatenate heads into single matrix. (b, n, m, k) -> (b, m, n * k)
    """
    tensor = torch.transpose(tensor, 1, 2)
    dim = tensor.shape

    matrix = torch.reshape(
        tensor, 
        shape=(dim[0], dim[1], dim[2] * dim[3])
    )

    return matrix