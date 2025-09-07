from server.main import views
from django.urls import path

urlpatterns = [
    path("", view=views.index, name="main"),
    path("file-list/", view=views.get_filepaths, name="file-list"),
    path("prediction-conf/", view=views.prediction_conf, name="prediction-conf"),
    path("chunk-scanner/", view=views.predict_chunks, name="chunk-scanner")
]