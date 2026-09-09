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

- Python version required: *v3.11.0*
- Python libraries and frameworks required:
    - **Django** *(v5.2.5)*: Web framework for frontend UI and backend server.
    - **torch** *(v2.7.1+cu128)*: Machine learning library for developing and training models with different architectures.
    - **numpy** *(v1.24.3)*: Library for conducting scientific computing on multidimensional arrays.
    - **matplotlib** *(v3.7.1)*: Plotting library for displaying ML model benchmarking graphs.

## Starting Django Server & App Usage

Start the Django server by running the following set of commands below in the root directory.

For Windows OS 11:
```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m server.manage runserver
```

For Linux and mac OS:
```bash
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
python -m server.manage runserver
```

Enter the URL: http://127.0.0.1:8000/main in browser to display the main web page.

## Model Training

### Portable executable dataset

- This project uses the *Malware Detection PE-Based Analysis Using Deep Learning Algorithm Dataset* which contains a set of benign and malicious executable files used to train AI models for malware classification. Dataset is **not** included in this project and can be downloaded from: https://figshare.com/articles/dataset/Malware_Detection_PE-Based_Analysis_Using_Deep_Learning_Algorithm_Dataset/6635642. 
- Credits for this dataset can be found under [Acknowledgements](#acknowledgements).

### Data preparation

Below are the steps used to create the byte chunk dataset using the portable executable files:
1. All benign and malicious files were organized in the following directory structure:
```
./ml_workspace/
    dataset/
        file_dataset/
            clean/
                example_benign1.exe
                example_benign2.exe
                ...
            malicious/
                example_malicious1.exe
                example_malicious2.exe
                ...
```
2. All names of benign and malicious files were renamed to remove the ".exe" file using the `./ml_workspace/utils/remove_exe_ext.py` script to avoid accidental executation of malware on Windows Operating System.
3. All files in `./ml_workspace/dataset/file_dataset` were read as raw byte strings and segmented into fixed length tensor arrays of integers ranging from 0 to 255. 
4. Tensor arrays are stored in separate tensor files located in `./ml_workspace/dataset/tensor_dataset` which avoids having to load the entire dataset during training which can risk out of memory errors.

#### Training

AI models were created and trained using the `./ml_workspace/train.py` script which can be executed from the project directory using the following command:  
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

- License files for third party Python libraries are included in `./third_party_licenses` directory.

Model architecture/s:
- This project includes implementations of linear attention to reduce memory usage from the paper "Linformer: Self-Attention with Linear Complexity", reference below:  
Wang, S., Li, B. Z., Khabsa, M., Fang, H., & Ma, H. (2020). *Linformer: Self-Attention with Linear Complexity.* ArXiv.org. https://arxiv.org/abs/2006.04768

Machine learning dataset:
- Name: “Malware Detection PE-Based Analysis Using Deep Learning Algorithm Dataset”  
- Authors: Anh Pham Tuan, An Tran Hung Phuong, Nguyen Vu Thanh, Toan Nguyen Van
- Dataset date: 22/6/2018
- DOI: https://doi.org/10.6084/m9.figshare.6635642
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
    - License link: https://creativecommons.org/licenses/by/4.0/