import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPlayer from 'react-player';

const Cam = () => {
  const [active, setActive] = useState("");

  setTimeout(() => {
    setActive(true);
  }, 2000)

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
            width="30%"
            height="auto"
          />
        </>
      )}

    </div>
  );
};

export default Cam;
