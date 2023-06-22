import { useEffect, useRef } from "react";
import Hls from "hls.js";

const LiveStreamPage = () => {
  const videoRef = useRef(null);
  let hls;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      return;
    }

    hls = new Hls();
    hls.attachMedia(videoElement);

    const loadStream = async () => {
      try {
        const previousPosition = videoElement.currentTime;
        await hls.loadSource("http://localhost:3001/stream.m3u8");
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.currentTime = previousPosition;
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

  return (
    <div className="bg-slate-900 font-light opacity-80">
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        autoPlay
        muted
      >
        <track kind="metadata" label="time" />
        <track kind="metadata" label="live" />
      </video>
    </div>
  );
};

export default LiveStreamPage;











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
