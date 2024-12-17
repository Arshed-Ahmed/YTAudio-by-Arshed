
"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handleConvert = async () => {
    setLoading(true);
    setDownloadLink('');
    try {
      const response = await axios.post('http://localhost:8000/api/convert/', { url }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setDownloadLink(`http://localhost:8000${response.data.downloadUrl}`);
    } catch (error) {
      alert('Error: Unable to process the request.\nError: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">YTAudio by Arshed</h1>
        <h4 className="text-2xl font-bold mb-6">YouTube to MP3 Converter</h4>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border border-gray-400 rounded mb-4 w-80"
        />
        <button
          type='button'
          onClick={handleConvert}
          className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'
            }`}
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
        {downloadLink && (
          <div className="mt-4">
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download MP3
            </a>
          </div>
        )}
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
