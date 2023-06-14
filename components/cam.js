// import React, { useState, useEffect } from 'react';

// const Cam = () => {
//   const [videoKey, setVideoKey] = useState(0);
//   const [lastModified, setLastModified] = useState('');

//   const handleVideoUpdate = () => {
//     setVideoKey(prevKey => prevKey + 1);
//   };

//   useEffect(() => {
//     const pollInterval = setInterval(() => {
//       fetch('/api/video-timestamp')
//         .then(response => response.text())
//         .then(timestamp => {
//           if (timestamp !== lastModified) {
//             setLastModified(timestamp);
//             handleVideoUpdate();
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching video timestamp:', error);
//         });
//     }, 5000); // Poll every 5 seconds (adjust the interval as needed)

//     return () => {
//       clearInterval(pollInterval);
//     };
//   }, [lastModified]);

//   return (
//     <div>
//       <video key={videoKey} controls autoPlay>
//         <source src={`/api/stream?${Date.now()}`} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// };


// export default Cam;





// import Script from 'next/script';
// import { useEffect, useRef } from 'react';

// const Cam = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     // Set the source of the video element to the RTSP stream URL
//     videoElement.src = `rtsp://localhost:8554/stream`;
//     videoElement.play();

//     return () => {
//       videoElement.src = '';
//     };
//   }, []);

//   return (
//     <div>
//       <h1>RTSP Stream</h1>
//       <video ref={videoRef} controls style={{ width: '100%' }} />
//       <Script src="https://cdn.jsdelivr.net/npm/hls.js@latest" strategy="lazyOnload" />
//     </div>
//   );
// };

// export default Cam;








import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const Cam = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('http://localhost:8000/hls/stream.m3u8');
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
    }

    return () => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.detachMedia(videoElement);
        hls.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h1>RTSP Stream</h1>
      <video ref={videoRef} controls style={{ width: '100%' }} />
    </div>
  );
};

export default Cam;

