import React, { useState, useEffect } from 'react';

const Cam = () => {
  const [videoKey, setVideoKey] = useState(0);
  const [lastModified, setLastModified] = useState('');

  const handleVideoUpdate = () => {
    setVideoKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetch('/api/video-timestamp')
        .then(response => response.text())
        .then(timestamp => {
          if (timestamp !== lastModified) {
            setLastModified(timestamp);
            handleVideoUpdate();
          }
        })
        .catch(error => {
          console.error('Error fetching video timestamp:', error);
        });
    }, 5000); // Poll every 5 seconds (adjust the interval as needed)

    return () => {
      clearInterval(pollInterval);
    };
  }, [lastModified]);

  return (
    <div>
      <video key={videoKey} controls autoPlay>
        <source src={`/api/stream?${Date.now()}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};


export default Cam;
