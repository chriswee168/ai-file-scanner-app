from django.db import models

# Create your models here.

# Table for storing AI models and their folder paths.
class AIModelsTable(models.Model):
    model_name = models.CharField(max_length=100, primary_key=True)
    model_path = models.TextField()

# Table to store metadata of files from local host.
class FileTable(models.Model):
    file_name = models.CharField(max_length=100)
    file_path = models.TextField()
    file_size_bytes = models.BigIntegerField()