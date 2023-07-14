import React, { useEffect, useRef, useState } from "react";
import PlaybackOption from "./playback/playback_option";

const LiveStreamPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const context = canvasElement.getContext("2d");

    const generateThumbnails = () => {
      const thumbnailImages = [];
      const frameInterval = 1; // Interval in seconds between each frame capture

      const captureFrame = () => {
        context.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const thumbnailURL = canvasElement.toDataURL();
        thumbnailImages.push(thumbnailURL);
        setCurrentTime(videoElement.currentTime.toFixed(0));

        setTimeout(captureFrame, frameInterval * 1000);
      };

      captureFrame();
      setThumbnails(thumbnailImages);
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = { video: true };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch((error) => {
          console.error("Failed to get user media:", error);
        });

      generateThumbnails();
    }
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

  return (
    <div className="w-full h-screen px-3 bg-slate-900 space-y-3">
      <div className="font-light opacity-80">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin flex-1 sm:w-screen h-full"
          controls
          autoPlay
          muted
        />
        <div className="time-bar-container">
          <div className="time-bar">
            <div
              className="current-time"
              style={{ width: `${(currentTime / 12) * 100}%` }}
            >
              {currentTime}
            </div>
          </div>
        </div>
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
                  currentTime >= index && currentTime < index + 1 ? "active" : ""
                }`}
                onClick={() => {
                  const videoElement = videoRef.current;
                  videoElement.currentTime = index;
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "none" }}
      />
      <PlaybackOption videoRef={videoRef} />
    </div>
  );
};

export default LiveStreamPage;





// import { useEffect, useRef, useState } from "react";
// import Hls from "hls.js";
// import Playback_option from "./playback/playback_option";

// const LiveStreamPage = () => {
//   const videoRef = useRef(null);
//   let hls;
//   useEffect(() => {
//     const videoElement = videoRef.current;

//     if (!videoElement) return;

//     if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
//       videoElement.src = "http://localhost:3001/stream.m3u8";
//       videoElement.play();
//       return;
//     }

//     hls = new Hls();
//     hls.attachMedia(videoElement);

//     const loadStream = async () => {
//       try {
//         await hls.loadSource("http://localhost:3001/stream.m3u8");
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoRef.current.currentTime = videoRef.current.duration;
//           videoElement.play();
//         });
//       } catch (error) {
//         console.error("Failed to load HLS stream:", error);
//       }
//     };

//     loadStream();

//     return () => {
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, [videoRef]);
 

//   return (
//     <div className="w-full h-screen px-3 bg-slate-900 space-y-3">
//       <div className="font-light opacity-80">
//         <video
//           ref={videoRef}
//           className="video-js vjs-default-skin flex-1 sm:w-screen h-full"
//           controls
//           autoPlay
//           muted
        
//         />
        
//       </div>
//       <Playback_option 
//       videoRef={videoRef}
//       />
//     </div>
//   );
// };

// export default LiveStreamPage;





// import { useEffect, useRef, useState } from 'react';
// import Hls from 'hls.js';

// const LiveStreamPage = () => {
//   const playerRef = useRef(null);
//   const videoRef = useRef(null);
//   const [playbackPosition, setPlaybackPosition] = useState(0);
//   let hls;

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     if (!videoElement) return;

//     if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
//       // If the browser natively supports HLS playback, use the default React Player behavior
//       return;
//     }

//     hls = new Hls();
//     hls.attachMedia(videoElement);

//     const loadStream = async () => {
//       try {
//         const previousPosition = videoElement.currentTime;
//         await hls.loadSource('http://localhost:3001/stream.m3u8'); // Replace with your HLS stream URL
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoElement.currentTime = previousPosition;
//           videoElement.play();
//         });
//       } catch (error) {
//         console.error('Failed to load HLS stream:', error);
//       }
//     };

//     loadStream();

//     return () => {
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, [videoRef]);

//   return (
//     <div>
//       <video ref={videoRef} className="video-js vjs-default-skin" controls autoPlay muted />
//     </div>
//   );
// };

// export default LiveStreamPage;

// import { useEffect, useRef, useState } from 'react';
// import Hls from 'hls.js';

// const LiveStreamPage = () => {
//   const playerRef = useRef(null);
//   const videoRef = useRef(null);
//   const [playbackPosition, setPlaybackPosition] = useState(0);
//   let hls;

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     if (!videoElement) return;

//     if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
//       // If the browser natively supports HLS playback, use the default React Player behavior
//       return;
//     }

//     hls = new Hls();
//     hls.attachMedia(videoElement);

//     const loadStream = async () => {
//       try {
//         const previousPosition = videoElement.currentTime;
//         await hls.loadSource('http://localhost:3001/stream.m3u8'); // Replace with your HLS stream URL
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoElement.currentTime = previousPosition;
//           videoElement.play();
//         });
//       } catch (error) {
//         console.error('Failed to load HLS stream:', error);
//       }
//     };

//     loadStream();

//     const refreshInterval = setInterval(() => {
//       loadStream();
//     }, 5000); // Refresh every 5 seconds

//     return () => {
//       clearInterval(refreshInterval);
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, [videoRef]);

//   return (
//     <div>
//       <video ref={videoRef} className="video-js vjs-default-skin" controls autoPlay muted />
//     </div>
//   );
// };

// export default LiveStreamPage;

// import { useEffect, useRef } from 'react';
// import ReactPlayer from 'react-player';
// import Hls from 'hls.js';

// const LiveStreamPage = () => {
//   const playerRef = useRef(null);
//   const videoRef = useRef(null);
//   let hls;

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     if (!videoElement) return;

//     if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
//       // If the browser natively supports HLS playback, use the default React Player behavior
//       return;
//     }

//     hls = new Hls();
//     hls.attachMedia(videoElement);

//     const loadStream = async () => {
//       try {
//         await hls.loadSource('http://localhost:3001/stream.m3u8'); // Replace with your HLS stream URL
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           videoElement.play();
//         });
//       } catch (error) {
//         console.error('Failed to load HLS stream:', error);
//       }
//     };

//     loadStream();

//     const refreshInterval = setInterval(() => {
//       loadStream();
//     }, 5000); // Refresh every 5 seconds

//     return () => {
//       clearInterval(refreshInterval);
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <video ref={videoRef} className="video-js vjs-default-skin" controls autoPlay muted />
//     </div>
//   );
// };

// export default LiveStreamPage;
