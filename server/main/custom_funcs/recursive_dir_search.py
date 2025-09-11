import os
from time import ctime

# Recursively traverse all sub directories and files.
def recurse_dir(path: str, indent_text: str, filepaths: list[str], metadatas: list[dict]):
    for name in os.listdir(path):
        abs_path = os.path.join(path, name)

        # Edit entry name to display if directory.
        if os.path.isdir(abs_path):
            name = f"[{name}]"
            entry_type = "folder"
        elif os.path.isfile(abs_path):
            entry_type = "file"

        metadata = {
            "name": os.path.basename(abs_path),
            "type": entry_type,
            "absolute_path": abs_path,
            "size": os.path.getsize(abs_path),
            "last_created": ctime(os.path.getctime(abs_path)),
            "last_accessed": ctime(os.path.getatime(abs_path)),
            "last_modified": ctime(os.path.getmtime(abs_path))
        }

        filepaths.append(indent_text + name)
        metadatas.append(metadata)
        
        if os.path.isdir(abs_path):
            recurse_dir(abs_path, indent_text + "| ", filepaths, metadatas)
        elif os.path.isfile(abs_path):
            pass

# Wrapper function for recursive directory traversal.
def search_dir(root_path: str) -> tuple[list[str], list[dict]]:
    # List of filepaths to return.
    filepaths: list[str] = []
    metadatas: list[dict] = []

    # Check if the path is a valid directory.
    if os.path.isdir(root_path):
        # Recursively search directory.
        indent_text = ""
        recurse_dir(root_path, indent_text, filepaths, metadatas)
    
    else:
        pass

    return filepaths, metadatas