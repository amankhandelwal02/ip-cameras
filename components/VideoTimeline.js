// import React, { useRef, useState, useEffect } from 'react';
// import { MdPlayArrow, MdPause } from 'react-icons/md';

// const VideoTimeline = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [thumbnails, setThumbnails] = useState([]);

//   useEffect(() => {
//     const videoElement = videoRef.current

//     const generateThumbnails = () => {
//       const canvasElement = canvasRef.current;
//       const context = canvasElement.getContext('2d');
//       const interval = Math.floor(videoElement.duration / 10); // Generate 10 thumbnails
//       const thumbnailImages = [];

//       for (let i = 0; i < 10; i++) {
//         const time = i * interval;
//         videoElement.currentTime = time;
//         context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
//         const thumbnailURL = canvasElement.toDataURL();
//         thumbnailImages.push(thumbnailURL);
//       }

//       setThumbnails(thumbnailImages);
//     };

//     generateThumbnails();
//   }, []);

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//     const videoElement = videoRef.current;
//     if (isPlaying) {
//       videoElement.pause()
//     } else {
//       videoElement.play();
//     }
//   };

//   const handleTimeUpdate = () => {
//     const videoElement = videoRef.current;
//     setCurrentTime(videoElement.currentTime);
//   };

//   const handleSeek = (time) => {
//     const videoElement = videoRef.current;
//     videoElement.currentTime = time;
//   };

//   return (
//     <div className="video-container">
//       <div className="video-player">
//         <video
//           ref={videoRef}
//           src="/earth.mp4"
//           onTimeUpdate={handleTimeUpdate}
//           controls
//         />
//       </div>
//       <div className="controls">
//         <button className="play-pause-btn" onClick={handlePlayPause}>
//           {isPlaying ? <MdPause /> : <MdPlayArrow />}
//         </button>
//         <div className="timeline">
//           {thumbnails.map((thumbnailURL, index) => (
//             <img
//               key={index}
//               src={thumbnailURL}
//               alt={`Thumbnail ${index}`}
//               className={`thumbnail ${
//                 currentTime >= index * 10 && currentTime < (index + 1) * 10 ? 'active' : ''
//               }`}
//               onClick={() => handleSeek(index * 10)}
//             />
//           ))}
//         </div>
//       </div>
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// };

// export default VideoTimeline;

import React, { useRef, useState, useEffect } from 'react';
import { MdPlayArrow, MdPause } from 'react-icons/md'

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

      canvasElement.width = thumbnailCount * 100; // Adjust the width based on the number of thumbnails

      for (let i = 0; i < thumbnailCount; i++) {
        const time = i;
        videoElement.currentTime = time;
        context.drawImage(videoElement, i * 100, 0, 100, canvasElement.height); // Adjust the size of each thumbnail
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
        {/* <button className="play-pause-btn" onClick={handlePlayPause}>
          {isPlaying ? <MdPause /> : <MdPlayArrow />}
        </button> */}
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
