const express = require("express");
const app = express();
const NodeWebcam = require("node-webcam");
const fs = require("fs");
const { spawn } = require("child_process");
const outputPath = "./output";
const rtspOutputUrl = "rtsp://localhost:8554/stream";
const videoPath = "./output/output.mp4";

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

// Start capturing and saving image frames
function captureFrame() {
  const filePath = `${outputPath}/output.jpg`;

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      console.log("Image captured:", data);
      captureFrame(); // Recursively capture next frame
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

// Convert captured image frames to MP4 video
function convertToVideo() {
  const ffmpegProcess = spawn("ffmpeg", [
    "-y",
    "-framerate",
    "1",
    "-i",
    `${outputPath}/output_%d.jpg`,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    videoPath,
  ]);

  ffmpegProcess.on("exit", () => {
    console.log("Video conversion completed:", videoPath);
    captureFrame(); // Start capturing frames again
  });
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

// Start capturing frames and converting to video
captureFrame();
convertToVideo();

// Serve the RTSP stream page
app.get("/", (req, res) => {
  res.send(`
    <video src="${rtspOutputUrl}" controls autoplay></video>
  `);
});

// Serve the converted video file as RTSP stream
app.get("/stream", (req, res) => {
  const stream = fs.createReadStream(videoPath);
  stream.pipe(res);
});

app.listen(8554, () => {
  console.log("RTSP server is running on port 8554");
});
