import React from 'react';

const WebcamStream = () => (
  <div>
    <video controls>
      <source src="/api/stream" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);

export default WebcamStream;
