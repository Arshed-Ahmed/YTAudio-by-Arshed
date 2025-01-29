
"use client";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DownloadIcon from '@mui/icons-material/Download';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Menu, MenuItem, Paper, Tooltip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useRef, useState } from 'react';
import { Bounce, toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Thumbnail from './Thumbnail';

const theme = createTheme({
  palette: {
    primary: {
      light: '#333333',
      main: '#1c1c1c',
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffffff',
      main: '#ececec',
      dark: '#b2b2b2',
      contrastText: '#000',
    },
  },
});

const YTAudio = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>('');
  const [format, setFormat] = useState<string>("audio");
  const [quality, setQuality] = useState<string>("128K");
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<{ url: string, title: string, uploader: string } | null>(null);
  const [qualityDialog, setQualityDialog] = useState<boolean>(false);

  const notify = (type: 'success' | 'error' | 'info' | 'warning', message: string, position: ToastPosition = "top-center", duration: number = 5000) => {
    toast[type](message, {
      position: position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      transition: Bounce,
    });
  };

  const isValidYouTubeURL = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    const valid = regex.test(url);
    if (!valid) {
      notify('error', 'Invalid YouTube URL.', "top-right");
    }
    return valid;
  };

  const handleDownload = () => {
    // Set dynamic file name
    const fileName = thumbnail?.title || 'download';
    const fileExtension = format === 'audio' ? 'mp3' : 'mp4';

    // Create a temporary <a> element and trigger a click
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = `${fileName}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    notify('success', "Downloaded successfully.");
    document.body.removeChild(a);
  };

  const handleConvert = async () => {
    const valid = isValidYouTubeURL(url);
    if (!valid) return;
    setDownloading(true);
    setDownloadLink('');
    console.log(url, format, quality);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/download/",
        { link: url, format, quality },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const link = window.URL.createObjectURL(blob);
      setDownloadLink(link);
      notify('info', 'Download link generated successfully.');
    } catch (error) {
      notify('error', `Error: ${error}`, "top-right");
      console.log('Error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleGetThumbnail = async () => {
    const valid = isValidYouTubeURL(url);
    if (!valid) return;
    setLoading(true);
    console.log(url, format, quality);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/view/",
        { link: url },
        { responseType: 'json' }
      );
      setThumbnail({ url: response.data.thumbnail, title: response.data.title, uploader: response.data.uploader });
    } catch (error) {
      notify('error', `Error: ${error}`, "top-right");
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }

    handleConvert();
  };

  const handleNext = () => {
    setThumbnail(null);
    setDownloadLink('');
    setUrl('');
    setQuality('128K');
    setFormat('audio');
    inputRef.current?.focus();
  };

  const handleOpenQualityDialog = () => {
    setQualityDialog(true);
  }

  const handleCloseQualityDialog = () => {
    setQualityDialog(false);
  };

  const handleFormat = (value: string) => {
    setFormat(value);
    setQuality(value === 'audio' ? '128K' : '720P');
  }

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMenuClose = (value: string | null) => {
    setAnchorEl(null);
    if (value) handleFormat(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* Toast Container */}
        <ToastContainer />
        <div className="flex flex-col items-center justify-center px-10 py-20 bg-gray-100">
          <h1 className="text-4xl font-bold mb-6">YTAudio by Arshed</h1>
          <h4 className="text-2xl font-bold mb-6">YouTube - Audio/ Video Downloader</h4>

          {/* Input Field */}
          {!thumbnail && (<div className="flex w-full sm:w-full lg:w-2/3 2xl:w-3/8 items-center">
            {/* <Input type="text" placeholder="Please paste the the YouTube video URL here" /> */}
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <InputBase
                ref={inputRef}
                sx={{ ml: 1, flex: 1 }}
                placeholder="Please paste the YouTube video URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Tooltip title="Format">
                <IconButton type="button" sx={{ p: '10px' }} aria-label="cut" onClick={handleMenuOpen}>
                  {format === 'audio' ? <MusicNoteIcon /> : <VideoCameraBackIcon />}
                </IconButton>
              </Tooltip>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Tooltip title="Quality">
                <IconButton type="button" sx={{ p: '10px' }} size="small" aria-label="Quality" onClick={handleOpenQualityDialog}>
                  {quality}
                </IconButton>
              </Tooltip>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Tooltip title="Convert">
                <IconButton type="button" sx={{ p: '10px' }} size="large" aria-label="Convert" onClick={handleGetThumbnail} loading={loading}>
                  <AutorenewIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </div>)}

          {/* Quality Dialog */}
          <Dialog open={qualityDialog} onClose={handleCloseQualityDialog}>
            <DialogTitle>
              {format === 'audio' ? <MusicNoteIcon /> : <VideoCameraBackIcon />} Select {format === 'audio' ? 'Audio' : 'Video'} Quality
            </DialogTitle>
            <DialogContent>
              <ButtonGroup
                disableElevation
                color="primary"
                aria-label="Disabled button group"
              >
                {format === 'audio' && ["64K", "128K", "192K", "256K", "320K"].map((item) => (
                  <Button key={item} variant={quality == item ? "contained" : "outlined"} onClick={() => setQuality(item)}>{item}</Button>
                ))}
                {format === 'video' && ["240P", "360P", "480P", "720P", "1080P"].map((item) => (
                  <Button key={item} variant={quality == item ? "contained" : "outlined"} onClick={() => setQuality(item)}>{item}</Button>
                ))}
              </ButtonGroup>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleCloseQualityDialog}>Save</Button>
              <Button variant="outlined" onClick={handleCloseQualityDialog}>Cancel</Button>
            </DialogActions>
          </Dialog>

          {/* Format Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose(null)}>
            <MenuItem onClick={() => handleMenuClose('audio')}>
              <MusicNoteIcon sx={{ mr: 1 }} /> Audio
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose('video')}>
              <VideoCameraBackIcon sx={{ mr: 1 }} /> Video
            </MenuItem>
          </Menu>

          {/* Display Thumbnail */}
          {thumbnail && (
            <Thumbnail thumbnail={thumbnail.url} title={thumbnail.title} uploader={thumbnail.uploader} />
          )}

          {thumbnail && (
            <div className='flex gap-5 mt-5'>
              <Button variant='contained' onClick={() => handleDownload()} loading={downloading} loadingPosition="start"> Download {format === "audio" ? 'MP3' : 'MP4'} &nbsp; <DownloadIcon /> </Button>
              <Button variant='outlined' onClick={() => handleNext()} > Convert Next &nbsp; <AutorenewIcon /> </Button>
            </div>
          )}

        </div>
        <Divider />
        {/* Instructions */}
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Instructions</h2>
          <ul className="text-lg list-disc">
            <li>Copy the YouTube video URL and paste it in the input field above.</li>
            <li>Select the format (Audio/ Video) in &quot;<MusicNoteIcon />&quot; or &quot;<VideoCameraBackIcon />&quot;.</li>
            <li>Click on the convert button  &quot;<AutorenewIcon />&quot; to generate the download link.</li>
            <li>Click on the download link to download the file when the button is available.</li>          </ul>
        </div>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default YTAudio;