# AI file scanner app
An AI powered local web app for scanning files and classifying byte chunks as either benign
or malicious.

List of Contents:
1. [Dependencies](#dependencies)
2. [Usage](#usage)
    - [Starting App](#starting-app)
    - [Model Training](#model-training)
3. [Acknowledgements](#acknowledgements)

## Dependencies

Python version required: 3.11.0
- Frontend UI is implemented using HTML, CSS and Javascript.
- Backend server is implemented using Django.
- Machine learning models for next token prediction are implemented  
in PyTorch, more details under [Model Training](#model-training).

Necessary Python libraries for the backend can be installed by running:  
`pip install -r requirements.txt`
