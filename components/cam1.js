import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef();

  useEffect(() => {
    // Retrieve the video element
    const video = videoRef.current;

    // Load the RTSP stream
    video.src = "http://localhost:3000/live/stream";
    video.play();
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="360" controls></video>
    </div>
  );
}
