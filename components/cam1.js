// import React, { useState, useEffect } from "react";
// import ReactPlayer from "react-player";

// const Cam1 = () => {
//   const [active, setActive] = useState(false);
//   const [streamUrl, setStreamUrl] = useState("");

//   useEffect(() => {
//     // Simulating an asynchronous operation to fetch the stream URL
//     setTimeout(() => {
//       setStreamUrl("http://localhost:3001/stream.m3u8");
//       setActive(true);
//     }, 2000);
//   }, []);

//   return (
//     <div>
//       {active ? (
//         <>
//           <h1>Stream Viewer</h1>
//           <ReactPlayer
//             url={streamUrl}
//             playing={true}
//             controls={true}
//             muted={true}
//             width="60%"
//             height="auto"
//           />
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Cam1;

// import React, { useState, useEffect } from "react";
// import ReactPlayer from "react-player";

// const Cam1 = () => {
//   const [active, setActive] = useState(false);
//   const [streamUrl, setStreamUrl] = useState("");
//   const [playlistContent, setPlaylistContent] = useState("");

//   useEffect(() => {
//     // Simulating an asynchronous operation to fetch the initial playlist
//     setTimeout(() => {
//       const initialPlaylist = generatePlaylistContent(1);
//       setPlaylistContent(initialPlaylist);
//       setStreamUrl("http://localhost:3001/stream.m3u8"); // Set the initial stream URL
//       setActive(true);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     // Simulating continuous updates to the playlist
//     const updateInterval = setInterval(() => {
//       const updatedPlaylist = generatePlaylistContent(1); // Update with the correct frame count
//       setPlaylistContent(updatedPlaylist);
//       // Update the stream URL with the new playlist
//       setStreamUrl("http://localhost:3001/stream.m3u8?" + Date.now());
//     }, 20000); // Set the interval according to the frame rate

//     return () => {
//       clearInterval(updateInterval);
//     };
//   }, []);

//   const generatePlaylistContent = (frameCount) => {
//     const playlistHeader = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:1\n#EXT-X-MEDIA-SEQUENCE:${frameCount}\n`;
//     const playlistItem = `#EXTINF:1.000000,\noutput_${frameCount}.ts\n`;
//     const playlistFooter = "#EXT-X-ENDLIST";
//     return playlistHeader + playlistItem + playlistFooter;
//   };

//   return (
//     <div>
//       {active ? (
//         <>
//           <h1>Stream Viewer</h1>
//           <ReactPlayer
//             url={streamUrl}
//             playing={true}
//             controls={true}
//             muted={true}
//             width="60%"
//             height="auto"
//           />
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };


// export default Cam1;











import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

const Cam1 = () => {
  const [active, setActive] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [playlistContent, setPlaylistContent] = useState("");
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    // Simulating an asynchronous operation to fetch the initial playlist
    setTimeout(() => {
      const initialPlaylist = generatePlaylistContent(frameCount);
      setPlaylistContent(initialPlaylist);
      setStreamUrl("http://localhost:3001/stream.m3u8"); // Set the initial stream URL
      setActive(true);
    }, 1000);
  }, [playlistContent]);

  useEffect(() => {
    // Simulating continuous updates to the playlist
    const updateInterval = setInterval(() => {
      const updatedPlaylist = generatePlaylistContent(frameCount); // Generate playlist with the latest frame
      setPlaylistContent(updatedPlaylist);
      // Update the stream URL with the new playlist
      setStreamUrl("http://localhost:3001/stream.m3u8?" + Date.now());
      setFrameCount((prevFrameCount) => prevFrameCount + 1); // Increment the frame count
    }, 20000); // Set the interval according to the frame rate

    return () => {
      clearInterval(updateInterval);
    };
  }, [frameCount]);

  const generatePlaylistContent = (frameCount) => {
    const playlistHeader = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:1\n#EXT-X-MEDIA-SEQUENCE:${frameCount}\n`;
    const playlistItem = `#EXTINF:1.000000,\noutput_${frameCount}.ts\n`;
    const playlistFooter = "#EXT-X-ENDLIST";
    return playlistHeader + playlistItem + playlistFooter;
  };

  return (
    <div>
      {active ? (
        <>
          <h1>Stream Viewer</h1>
          <ReactPlayer
            url={streamUrl}
            playing={true}
            controls={true}
            muted={true}
            width="60%"
            height="auto"
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Cam1;








// import { useEffect, useRef } from 'react';
// import videojs from 'video.js/dist/video.js';
// import 'video.js/dist/video-js.css';


// const Cam1 = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     let player;

//     const setupPlayer = () => {
//       if (videoRef.current) {
//         const player = videojs(videoRef.current);
    
//         player.src({
//           src: 'http://localhost:3001/stream.m3u8', // Replace with your HLS live stream URL
//           type: 'application/x-mpegURL'
//         });
    
//         player.play();
//       }
//     };
    

//     setupPlayer();

//     return () => {
//       if (player) {
//         player.dispose();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <video ref={videoRef} className="video-js vjs-default-skin" controls autoPlay muted />
//     </div>
//   );
// };

// export default Cam1;