from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
from pytube import YouTube
import os
import yt_dlp

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
        
class YTDownloadAPIView(APIView):
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        try:
            link = request.data.get("link")
            format_type = request.data.get("format")
            quality = request.data.get("quality")

            if not link or not format_type:
                return Response({"error": "Invalid parameters."}, status=status.HTTP_400_BAD_REQUEST)

            download_path = os.path.join(os.getcwd(), "downloads")
            os.makedirs(download_path, exist_ok=True)

            # Configure yt-dlp options
            ydl_opts = self.get_download_options(format_type, quality, download_path)

            # Download using yt-dlp
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(link, download=True)
                file_path = ydl.prepare_filename(info_dict)
                file_path = self.adjust_file_extension(file_path, format_type)

            if not file_path or not os.path.exists(file_path):
                return Response({"error": "File download failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get_download_options(self, format_type, quality, download_path):
        """Returns yt-dlp options based on format and quality."""
        ydl_opts = {
            "outtmpl": os.path.join(download_path, "%(title)s.%(ext)s"),
            "noplaylist": True,
            "quiet": True
        }

        if format_type == "audio":
            ydl_opts["format"] = self.get_audio_quality(quality)
            ydl_opts["postprocessors"] = [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": quality.replace("K", "") if quality else "192",
            }]

        elif format_type == "video":
            ydl_opts["format"] = self.get_video_quality(quality)

        return ydl_opts

    def get_audio_quality(self, quality):
        """Returns the best available audio quality format."""
        quality_map = {
            "64K": "bestaudio[abr<=64]",
            "128K": "bestaudio[abr<=128]",
            "192K": "bestaudio[abr<=192]",
            "256K": "bestaudio[abr<=256]",
            "320K": "bestaudio[abr<=320]"
        }
        return quality_map.get(quality, "bestaudio/best")

    def get_video_quality(self, quality):
        """Returns the best available video quality format."""
        quality_map = {
            "240P": "bestvideo[height<=240]+bestaudio/best",
            "360P": "bestvideo[height<=360]+bestaudio/best",
            "480P": "bestvideo[height<=480]+bestaudio/best",
            "720P": "bestvideo[height<=720]+bestaudio/best",
            "1080P": "bestvideo[height<=1080]+bestaudio/best"
        }
        return quality_map.get(quality, "best")

    def adjust_file_extension(self, file_path, format_type):
        """Adjusts file extension for converted audio files."""
        if format_type == "audio" and file_path.endswith(".webm"):
            return file_path.replace(".webm", ".mp3")
        return file_path

class YTThumbnailAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Retrieve parameters from the request
            link = request.data.get("link")

            if not link:
                return Response({"error": "Invalid parameters."}, status=status.HTTP_400_BAD_REQUEST)

            # Define yt-dlp options
            ydl_opts = {
                "noplaylist": True,
                "quiet": True,
            }

            # Extract metadata using yt-dlp
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(link, download=False)
                
            formats = info_dict["formats"]
            thumbnail = info_dict.get("thumbnail")
            # Check if formats is a list of dictionaries before processing
            available_format_list = [
                {
                    "format_id": f.get("format_id", "N/A"),  # Ensure key exists
                    "ext": f.get("ext", "unknown"),
                    "resolution": f.get("height", "audio-only") if "height" in f else "audio-only",
                    "abr": f.get("abr", None),  # Audio bitrate (if available)
                    "fps": f.get("fps", None),  # Frames per second (if available)
                }
                for f in formats
            ]

            if not thumbnail:
                return Response({"error": "Metadata extraction failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Return metadata as a response
            return Response({
                "thumbnail": thumbnail,
                "title": info_dict.get("title"),
                "uploader": info_dict.get("uploader"),
                "available_formats": available_format_list
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
