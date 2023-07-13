import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const LiveStreamPage = () => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  let hls;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = "http://localhost:3001/stream.m3u8";
      videoElement.play();
      return;
    }

    hls = new Hls();
    hls.attachMedia(videoElement);

    const loadStream = async () => {
      try {
        await hls.loadSource("http://localhost:3001/stream.m3u8");
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.currentTime = videoRef.current.duration;
          videoElement.play();
        });
      } catch (error) {
        console.error("Failed to load HLS stream:", error);
      }
    };

    loadStream();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoRef]);

  useEffect(() => {
    let animationFrameId;

    const updateTime = () => {
      setCurrentTime(videoRef.current.currentTime);
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-screen px-3 bg-slate-900 space-y-3">
      <div className="font-light opacity-80">
        <video ref={"/earth.mp4"} className="video-js vjs-default-skin flex-1 sm:w-screen h-full" controls autoPlay muted />
        <div className="text-white">{formatTime(currentTime)}</div>
      </div>
    </div>
  );
};

export default LiveStreamPage;

// import React, { useEffect, useRef, useState } from 'react';

// const VideoTimeline = ({ videoPath }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const scrubberRef = useRef(null);
//   const [thumbnails, setThumbnails] = useState([]);
//   const [scrubberPosition, setScrubberPosition] = useState(0);
//   const [isDurationAvailable, setIsDurationAvailable] = useState(false);

//   useEffect(() => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const scrubber = scrubberRef.current;
//     const context = canvas.getContext('2d');

//     video.src = "/earth.mp4";

//     const handleCanPlayThrough = () => {
//       const { videoWidth, videoHeight, duration } = video;
//       const thumbnailWidth = 100;
//       const numThumbnails = Math.ceil(duration);

//       canvas.width = thumbnailWidth;
//       canvas.height = thumbnailWidth * (videoHeight / videoWidth);

//       const interval = duration / numThumbnails;
//       const newThumbnails = [];

//       let currentTime = 0;

//       const captureFrame = () => {
//         if (currentTime >= duration) {
//           video.pause();
//           setThumbnails(newThumbnails);
//           return;
//         }

//         video.currentTime = currentTime;
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const thumbnail = canvas.toDataURL('image/png');
//         newThumbnails.push(thumbnail);

//         currentTime += interval;

//         requestAnimationFrame(captureFrame);
//       };

//       requestAnimationFrame(captureFrame);
//       setIsDurationAvailable(true);
//     };

//     const handleTimeUpdate = () => {
//       if (isDurationAvailable) {
//         const { currentTime, duration } = video;
//         const scrubberWidth = scrubber.clientWidth;
//         const progress = (currentTime / duration) * 100;
//         const position = (progress * scrubberWidth) / 100;

//         setScrubberPosition(position);
//       }
//     };

//     video.addEventListener('canplaythrough', handleCanPlayThrough);
//     video.addEventListener('timeupdate', handleTimeUpdate);

//     return () => {
//       video.removeEventListener('canplaythrough', handleCanPlayThrough);
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//     };
//   }, [videoPath, isDurationAvailable]);

//   const handleScrubberClick = (event) => {
//     if (!isDurationAvailable) {
//       return;
//     }

//     const scrubber = scrubberRef.current;
//     const { left, width } = scrubber.getBoundingClientRect();
//     const clickX = event.clientX;
//     const position = clickX - left;
//     const scrubberWidth = scrubber.clientWidth;
//     const progress = (position / scrubberWidth) * 100;
//     const video = videoRef.current;
//     const duration = video.duration;

//     video.currentTime = (progress / 100) * duration;
//   };

//   return (
//     <div>
//       <video ref={videoRef} controls autoPlay={false} />
//       <div className="timeline" onClick={handleScrubberClick}>
//         <canvas ref={canvasRef} style={{ display: 'none' }} />
//         <div className="scrubber" ref={scrubberRef}>
//           {isDurationAvailable && (
//             <div
//               className="scrubber-handle"
//               style={{ left: `${scrubberPosition}px` }}
//             ></div>
//           )}
//         </div>
//         {thumbnails.map((thumbnail, index) => (
//           <img
//             key={index}
//             src={thumbnail}
//             alt={`Thumbnail ${index}`}
//             className="thumbnail"
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoTimeline;
