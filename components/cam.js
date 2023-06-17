import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPlayer from 'react-player';

const Cam = () => {
  // const [streamUrl, setStreamUrl] = React.useState('');

  // React.useEffect(() => {
  //   fetch('/api/hls')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("data: " + data.streamUrl)
  //       setStreamUrl(data.streamUrl);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching stream URL:', error);
  //     });
  // }, []);

  const [active, setActive] = useState("");

  setTimeout(() => {
    setActive(true);
  }, 2000)

  return (
    <div>
      {/* {streamUrl && streamUrl.length > 0 && (
        <>
          <h1>Stream Viewer</h1>
          <ReactPlayer
            url={streamUrl}
            playing={true}
            controls={true}
            muted={true}
            width="30%"
            height="auto"
          />
        </>
      )} */}

      {active && (
        <>
          <h1>Stream Viewer</h1>
          <ReactPlayer
            url={"http://localhost:3001/stream.m3u8"}
            playing={true}
            controls={true}
            muted={true}
            width="30%"
            height="auto"
          />
        </>
      )}

    </div>
  );
};

export default Cam;

