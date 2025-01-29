from django.urls import path
from .views import DownloadYouTubeVideo, YTDownloadAPIView ,YTThumbnailAPIView

urlpatterns = [
    path("download/", YTDownloadAPIView.as_view(), name="download"),
    path("view/", YTThumbnailAPIView.as_view(), name="view"),
]
