import os, sys

if len(sys.argv) < 2 or len(sys.argv) > 2:
    print("Script to remove .exe extension from all files in specified directory.")
    print("Usage: python remove_exe_ext.py <directory_path>")
else:
    path = sys.argv[1]
    if os.path.exists(path):
        for root, _, files in os.walk(path):
            for file in files:
                if file.lower().endswith(".exe"):
                    old_path = os.path.join(root, file)
                    new_path = os.path.join(root, file.lower().replace(".exe", ""))
                    os.rename(old_path, new_path)
                    print(f"Renamed: {old_path} -> {new_path}")
    else:
        print(f"Path \"{path}\" doesn't exist.")