const express = require("express");
const app = express();
const NodeWebcam = require("node-webcam");
const { spawn } = require("child_process");
const WebSocket = require("ws");
const RtspServer = require("node-rtsp-stream");

// Configure webcam
const Webcam = NodeWebcam.create({
  device: "FaceTime HD Camera",
  width: 1280,
  height: 720,
  quality: 80,
  delay: 0,
  output: "jpeg",
  verbose: false,
});

// WebSocket server for streaming
const wss = new WebSocket.Server({ port: 8080 });

// Capture and stream frames
function captureAndStream() {
  const filePath = "./output/output.jpg";

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      // Stream the captured frame to connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });

      // Capture and stream the next frame
      captureAndStream();
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

// Convert captured frames to RTSP stream using FFmpeg
function convertToRtspStream() {
  const ffmpegProcess = spawn("ffmpeg", [
    "-y",
    "-loop",
    "1",
    "-i",
    "./output/output.jpg",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-tune",
    "zerolatency",
    "-vf",
    "fps=30",
    "-f",
    "rtsp",
    "rtsp://localhost:8554/live/stream",
  ]);

  ffmpegProcess.on("exit", () => {
    console.log("RTSP streaming completed");
  });
}

// Start capturing and streaming frames
captureAndStream();
convertToRtspStream();

// Serve the RTSP stream page
app.get("/", (req, res) => {
  res.send(`
    <script src="https://cdn.jwplayer.com/libraries/dzVwUqoA.js"></script>
    <div id="player"></div>
    <script>
      jwplayer("player").setup({
        file: "rtsp://localhost:8554/live/stream",
        type: "rtmp/mp4",
        autostart: true,
        width: "640",
        height: "360",
      });
    </script>
  `);
});

// Start the server
const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Start the RTSP server
const rtspServer = new RtspServer({
  serverPort: 8554,
  clientPort: 8000,
});
rtspServer.start();
