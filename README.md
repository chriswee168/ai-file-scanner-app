# AI file scanner app
An AI powered local web app for scanning byte chunks of portable executable files and  
classifying them as either benign or malicious.

List of Contents:
1. [Dependencies](#dependencies)
2. [Usage](#usage)
    - [Starting App](#starting-app)
    - [Model Training](#model-training)
        - [Portable executable dataset](#portable-executable-dataset)
        - [Data preparation](#data-preparation)
        - [Training](#training)
3. [Acknowledgements](#acknowledgements)

## Dependencies

Python version required: 3.11.0
- Frontend UI is implemented using HTML, CSS and Javascript.
- Backend server is implemented using Django.
- Machine learning models for next token prediction are implemented  
in PyTorch, more details under [Model Training](#model-training).

Necessary Python libraries for the backend can be installed by running:  
`pip install -r requirements.txt`

## Usage

### Starting App

```
# Run the command below in the project directory to start the Django server.
python -m server.manage runserver

# Enter the URL: http://127.0.0.1:8000/main in browser to display the web page.
```
#### Data preparation

Below are the steps used to create the byte chunk dataset using the portable executable files:
1. All benign and virus files are organized in the following directory structure:
```
ml_workspace/
    dataset/
        clean/
            example_file1.exe
            example_file2.exe
            ...
        malicious/
            example_virus1.exe
            example_virus2.exe
            ...
```
2. All names of benign and virus files are renamed to remove the ".exe" file to avoid accidental executation using the following commands:
```
cd ml_workspace/dataset
python remove_exe.py
```

3. Byte chunks of every file in `ml_workspace/dataset` are obtained as tensors and saved in separate
PyTorch files. This avoids having to load the entire tensor dataset which can easily exceed memory if dataset is too large.  
(This step is performed by the training script in `ml_workspace/train.py`)

