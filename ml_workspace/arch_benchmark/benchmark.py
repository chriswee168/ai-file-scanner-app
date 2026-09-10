"""
Benchmarking script to record the amount of GPU memory and inference time models
have at varying context lengths.
"""
import time
import torch
import json
import os
import math
import matplotlib.pyplot as plt
from ml_workspace.model.Model import Model

# Default JSON configuration all models will use.
default_json_config = {
    "heads": 16,
    "blocks": 3,
    "embedding_len": 32,
    "attn_embedding_len": 16,
    "low_rank_proj": 256,
    "pos_encoding_type": "sinusoidal",
    "kernels_per_head": 3,
    "sinusoidal_n": 10000,
    
    "mlp_dense_layer_dims": [128]
}

# Initialise block types and context lengths for performance testing.
block_types = ["attention", "global_conv"]
ff_block_booleans = {"attention": True, "global_conv": False}
context_lens = [512]
for i in range(8):
    context_lens.append(context_lens[-1] * 2)

# Data to plot on graph.
plot_data = {
    "attention": {"memory_mb": [], "infer_ms": []}, 
    "global_conv": {"memory_mb": [], "infer_ms": []}
}

# Use CUDA if available.
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

for block_type in block_types:
    for context_len in context_lens:
        # Save temporary JSON config file.
        default_json_config["block_type"] = block_type
        default_json_config["context_len"] = context_len
        default_json_config["include_ff_blocks"] = ff_block_booleans[block_type]
        with open("temp_config.json", "w") as f:
            json.dump(default_json_config, f)

        # Create random test input.
        test_input = torch.randint(0, 255, size=(1, context_len)).to(device)

        # Create model and time inference.
        model = Model("temp_config.json", 0.0).to(device).eval()

        # Clear memory cache.
        torch.cuda.empty_cache()
        torch.cuda.reset_peak_memory_stats()

        # Time a single forward pass.
        start_time = time.perf_counter()
        with torch.inference_mode():
            model.forward(test_input)
        stop_time = time.perf_counter()

        # Save peak memory usage from both architectures.
        peak_memory_usage = math.ceil(torch.cuda.max_memory_allocated() / 1024**2)
        infer_time = (stop_time - start_time) * 1000
        plot_data[block_type]["memory_mb"].append(peak_memory_usage)
        plot_data[block_type]["infer_ms"].append(infer_time)

os.remove("temp_config.json")

# Graph plot data and save to PNG.
fig, (ax1) = plt.subplots(1, 1)
ax1.plot(context_lens, plot_data["attention"]["memory_mb"], label="Linear/Low Rank Attention", marker='o', color="red")
ax1.plot(context_lens, plot_data["global_conv"]["memory_mb"], label="Multi Head Global Conv", marker='o', color="blue")
ax1.set_xlabel("Context Length (Bytes)")
ax1.set_ylabel("GPU Memory (MB)")
ax1.set_title("Context Length vs GPU Memory")
ax1.tick_params("x", rotation=45)
ax1.legend()
ax1.grid(True, color="gray", linestyle="--", linewidth=0.5)

plt.tight_layout()
plt.show()

fig.savefig("ml_workspace/arch_benchmark/assets/benchmark_memory_graph.png")