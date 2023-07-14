import React, { useRef, useState, useEffect } from 'react';

const VideoTimeline = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const generateThumbnails = () => {
      const canvasElement = canvasRef.current;
      const context = canvasElement.getContext('2d');
      const videoDuration = videoElement.duration;
      const thumbnailCount = Math.ceil(videoDuration);
      const thumbnailImages = [];

      canvasElement.width = thumbnailCount * 100; 

      for (let i = 0; i < thumbnailCount; i++) {
        const time = i;
        videoElement.currentTime = time;
        context.drawImage(videoElement, i * 100, 0, 100, canvasElement.height); 
        const thumbnailURL = canvasElement.toDataURL();
        thumbnailImages.push(thumbnailURL);
      }

      setThumbnails(thumbnailImages)
    };

    generateThumbnails();
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    const videoElement = videoRef.current;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    setCurrentTime(videoElement.currentTime);
  };

  const handleSeek = (time) => {
    const videoElement = videoRef.current;
    videoElement.currentTime = time
  };

  return (
    <div className="video-container">
      <div className="video-player">
        <video
          ref={videoRef}
          src="/earth.mp4"
          onTimeUpdate={handleTimeUpdate}
          controls
        />
      </div>
      <div className="controls">
       
        <div className="timeline-container">
          <div className="timeline">
            {thumbnails.map((thumbnailURL, index) => (
              <img
                key={index}
                src={thumbnailURL}
                alt={`Thumbnail ${index}`}
                className={`thumbnail ${
                  currentTime >= index && currentTime < index + 1 ? 'active' : ''
                }`}
                onClick={() => handleSeek(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VideoTimeline
