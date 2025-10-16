import os

if os.path.exists("ml_workspace/dataset"):
    for root, _, files in os.walk("ml_workspace/dataset"):
        for file in files:
            if file.lower().endswith(".exe"):
                old_path = os.path.join(root, file)
                new_path = os.path.join(root, file.lower().replace(".exe", ""))
                os.rename(old_path, new_path)
                print(f"Renamed: {old_path} -> {new_path}")
else:
    print("Path ml_workspace/dataset doesn't exist.")