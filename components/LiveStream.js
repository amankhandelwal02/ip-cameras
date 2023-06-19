import React, { useEffect, useRef } from 'react';

const LiveStream = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/stream-events');

    eventSource.onmessage = (event) => {
      const streamData = event.data;

      if (videoRef.current) {
        videoRef.current.src = streamData;
        videoRef.current.play();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay controls />
    </div>
  );
};

export default LiveStream;
