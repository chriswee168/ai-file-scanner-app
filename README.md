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

## Usage

### Starting App

```
# Run the command below in the project directory to start the Django server.
python -m server.manage runserver

# Enter the URL: http://127.0.0.1:8000/main in browser to display the web page.
```
