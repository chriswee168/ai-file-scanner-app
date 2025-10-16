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

### Model Training

#### Portable executable dataset

- This project uses the dataset from "Malware Detection PE-Based Analysis Using Deep Learning Algorithm Dataset" by Tuan et al. (2018), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). More details can be found under [Acknowledgements](#acknowledgements).
- Dataset contains benign and malicious executable files. 
- ***Dataset is not included in this project and can be found at:***  
https://figshare.com/articles/dataset/Malware_Detection_PE-Based_Analysis_Using_Deep_Learning_Algorithm_Dataset/6635642

#### Data preparation

Below are the steps used to create the byte chunk dataset using the portable executable files:
1. All benign and virus files were organized in the following directory structure:
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
2. All names of benign and virus files were renamed to remove the ".exe" file to avoid accidental executation using the following commands:
```
cd ml_workspace/dataset
python remove_exe.py
```

3. Byte chunks of every file in `ml_workspace/dataset` were obtained as tensors and saved in separate
PyTorch files. This avoids having to load the entire tensor dataset which can easily exceed memory if dataset is too large.  
(This step is performed by the training script in `ml_workspace/train.py`)

#### Training

AI models were created and trained using the `ml_workspace/train.py` script which can be executed from the project directory using the following command:  
```
python -m ml_workspace.train
```

## Acknowledgements

Python libraries used:
- [Django](https://www.djangoproject.com/) — Python web framework used to implement the backend server.
    - License type: BSD 3-Clause
    - Link: https://github.com/django/django/blob/main/LICENSE
- [PyTorch](https://pytorch.org/) — Python machine learning library used to develop the AI models.
    - License type: BSD 3-Clause
    - Link: https://github.com/pytorch/pytorch/blob/main/LICENSE

Model architecture/s:
- This project includes implementations of linear attention to reduce memory usage from the paper "Linformer: Self-Attention with Linear Complexity", reference below:  
Wang, S., Li, B. Z., Khabsa, M., Fang, H., & Ma, H. (2020). *Linformer: Self-Attention with Linear Complexity.* ArXiv.org. https://arxiv.org/abs/2006.04768

Dataset reference:
- Tuan, A. P., Tran, A., Thanh, N. V., & Van, T. N. (2018). Malware Detection PE-Based Analysis Using Deep Learning Algorithm Dataset. Figshare. https://doi.org/10.6084/m9.figshare.6635642.v1