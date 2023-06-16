import React from 'react';
import ReactPlayer from 'react-player';

const MyVideoComponent = () => {
  const [videoUrl, setVideoUrl] = React.useState('http://localhost:3000/stream/playlist.m3u8');

  // React.useEffect(() => {
  //   const fetchVideoUrl = async () => {
  //     try {
  //       const response = await fetch('/api/videostream');
  //       if (response.ok) {
  //         console.log("response ok", response);
  //         const blob = await response.blob();
  //         const videoUrl = URL.createObjectURL(blob);
  //         setVideoUrl(videoUrl);
  //       } else {
  //         console.error('Failed to fetch video URL');
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };

  //   fetchVideoUrl();
  // }, []);

  return (
    <div>
      <h1>Video Streaming Example</h1>
      {videoUrl ? (
        <ReactPlayer url={videoUrl} playing controls width="100%" height="auto" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyVideoComponent;

