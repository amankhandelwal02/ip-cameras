import React, { useState } from "react";
import ReactPlayer from "react-player";

const Cam = () => {
  const [active, setActive] = useState("");

  setTimeout(() => {
    setActive(true);
  }, 2000);

  return (
    <div>
      {active && (
        <>
          <h1>Stream Viewer</h1>
          <ReactPlayer
            url={"http://localhost:3001/stream.m3u8"}
            playing={true}
            controls={true}
            muted={true}
            width="60%"
            height="auto"
          />
        </>
      )}
    </div>
  );
};

export default Cam;





// import React, { useEffect, useRef } from 'react';
// import ReactPlayer from "react-player";
// import Hls from 'hls.js';

// const Cam = () => {
  
//   const streamUrl = 'http://localhost:3001/stream.m3u8'; // Replace with your server URL

//   useEffect(() => {
//     let hls;

//     const initializePlayer = () => {
//       if (Hls.isSupported()) {
//         hls = new Hls();
//         hls.loadSource(streamUrl);
//         hls.attachMedia(videoRef.current);
//       } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         videoRef.current.src = streamUrl;
//       }
//     };

//     initializePlayer();

//     return () => {
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div>
//      <ReactPlayer
//             url={streamUrl}
//             playing={true}
//             controls={true}
//             muted={true}
//             width="30%"
//             height="auto"
//           />
//     </div>
//   );
// };



// export default Cam;
