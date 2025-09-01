from server.main import views
from django.urls import path

urlpatterns = [
    path("", view=views.index, name="main")
]