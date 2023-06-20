import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const LiveStream = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;

    const startStream = () => {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource('/api/stream.m3u8');
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play();
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = '/api/stream.m3u8';
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      }
    };

    startStream();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay controls />
    </div>
  );
};

export default LiveStream;
