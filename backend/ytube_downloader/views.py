from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
from pytube import YouTube
import os

class DownloadYouTubeVideo(APIView):
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        try:
            # Retrieve parameters from the request
            link = request.data.get("link")
            format = request.data.get("format")
            quality = request.data.get("quality")

            if not link or not format:
                return Response({"error": "Invalid parameters."}, status=status.HTTP_400_BAD_REQUEST)

            yt = YouTube(link)

            # Get the thumbnail URL
            thumbnail_url = yt.thumbnail_url

            # Determine the stream based on the format and quality
            if format == "audio":
                stream = yt.streams.filter(only_audio=True).first()
            else:
                if quality == "high":
                    stream = yt.streams.get_highest_resolution()
                elif quality == "medium":
                    stream = yt.streams.filter(res="360p").first()
                else:
                    stream = yt.streams.filter(res="144p").first()

            if not stream:
                return Response({"error": "Stream not found."}, status=status.HTTP_404_NOT_FOUND)

            # Create a downloads directory if it doesn't exist
            download_path = os.path.join(os.getcwd(), "downloads")
            os.makedirs(download_path, exist_ok=True)

            # Define the file path for the download
            file_path = stream.download(output_path=download_path)

            # Open the file and return it as a response
            with open(file_path, 'rb') as file:
                file_data = file.read()

            response = Response({
                'file_data': file_data,
                'thumbnail_url': thumbnail_url  # Add the thumbnail URL in the response
            }, content_type="application/octet-stream")
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'

            return response

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)