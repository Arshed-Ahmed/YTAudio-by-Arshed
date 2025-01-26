from django.urls import path
from .views import DownloadYouTubeVideo

urlpatterns = [
    path("download/", DownloadYouTubeVideo.as_view(), name="download"),
]
