// import fs from 'fs';

// export default function handler(req, res) {

//   const videoPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.mp4'; // Update with the path to your video file

//   const videoStat = fs.statSync(videoPath);
//   const fileSize = videoStat.size;
//   const range = req.headers.range;

//     // Set cache-control headers to prevent caching
//     res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//   if (range) {
//     const parts = range.replace(/bytes=/, '').split('-');
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//     const chunkSize = end - start + 1;
//     const file = fs.createReadStream(videoPath, { start, end });

//     const head = {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunkSize,
//       'Content-Type': 'video/mp4',
//     };

//     res.writeHead(206, head);
//     file.pipe(res);
//   } else {
//     const head = {
//       'Content-Length': fileSize,
//       'Content-Type': 'video/mp4',
//     };

//     res.writeHead(200, head);
//     fs.createReadStream(videoPath).pipe(res);
//   }
// }




const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const NodeWebcam = require("node-webcam");
const cors = require("cors");

const app = express();
app.use(cors());

const outputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output";
const hlsOutputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls";
const rtspOutputUrl = "rtsp://localhost:8554/live/stream";
app.use(express.static(hlsOutputPath));

const Webcam = NodeWebcam.create({
  device: "FaceTime HD Camera",
  width: 1280,
  height: 720,
  quality: 80,
  delay: 0,
  output: "jpeg",
  verbose: false,
});

let frameCount = 0;
let framePaths = [];
let isTranscoding = false;
let clients = [];

function captureFrame() {
  const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      console.log("Image captured:", data);
      framePaths.push(filePath);
      frameCount++;
      console.log("Frame count:", frameCount);

      if (!isTranscoding) {
        isTranscoding = true;
        transcodeToHLS();
      }
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

function transcodeToHLS() {
  const inputPattern = path.join(outputPath, "output_%d.jpg");

  const ffmpegProcess = spawn("ffmpeg", [
    "-y",
    "-start_number",
    frameCount - 10,
    "-framerate",
    "1",
    "-i",
    inputPattern,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-f",
    "hls",
    "-hls_time",
    "2",
    "-hls_list_size",
    "10",
    "-hls_segment_filename",
    path.join(hlsOutputPath, "output_%d.ts"),
    path.join(hlsOutputPath, "stream.m3u8"),
  ]);

  ffmpegProcess.on("exit", () => {
    console.log("HLS conversion completed");
    isTranscoding = false;

    // Notify all connected clients about the updated playlist
    sendPlaylistUpdate();
  });
}

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

setInterval(captureFrame, 1000);

const ffmpegProcess = spawn("ffmpeg", [
  "-y",
  "-framerate",
  "1",
  "-i",
  path.join(outputPath, "output_%d.jpg"),
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-f",
  "rtsp",
  rtspOutputUrl,
]);

ffmpegProcess.on("exit", () => {
  console.log("RTSP streaming completed:", rtspOutputUrl);
});

if (!fs.existsSync(hlsOutputPath)) {
  fs.mkdirSync(hlsOutputPath);
}

function updatePlaylist() {
  const playlistPath = path.join(hlsOutputPath, "stream.m3u8");
  const playlistContent = fs.readFileSync(playlistPath, "utf-8");

  const newSegmentDuration = 8; // Example duration, replace with your own logic

  const lines = playlistContent.trim().split("\n");

  let totalDuration = 0;
  let lastSegmentLine = "";

  lines.forEach((line) => {
    if (line.startsWith("#EXTINF:")) {
      const segmentDuration = parseFloat(line.split(":")[1]);
      totalDuration += segmentDuration;
    }
    if (line.endsWith(".ts")) {
      lastSegmentLine = line;
    }
  });

  const targetDuration = 8; // Example target duration, replace with your own logic

  if (totalDuration + newSegmentDuration > targetDuration) {
    const durationDiff = totalDuration + newSegmentDuration - targetDuration;
    const segmentDuration = parseFloat(lastSegmentLine.split(":")[1]);
    const newSegmentLine = lastSegmentLine.replace(
      `#EXTINF:${segmentDuration}`,
      `#EXTINF:${segmentDuration - durationDiff.toFixed(6)}`
    );
    lines[lines.length - 1] = newSegmentLine;
  } else {
    const newSegmentEntry = `#EXTINF:${newSegmentDuration.toFixed(6)},\noutput_${frameCount}.ts`;
    lines.push(newSegmentEntry);
  }

  const updatedPlaylistContent = lines.join("\n");

  fs.writeFileSync(playlistPath, updatedPlaylistContent, "utf-8");
  console.log("Playlist updated successfully");

  // Notify all connected clients about the updated playlist
  sendPlaylistUpdate();
}

setInterval(updatePlaylist, 5000); // Update the playlist every 5 seconds

function sendPlaylistUpdate() {
  const playlistPath = path.join(hlsOutputPath, "stream.m3u8");
  const playlistContent = fs.readFileSync(playlistPath, "utf-8");

  clients.forEach((client) => {
    client.write(`data: ${playlistContent}\n\n`);
  });
}

app.get("/api/getPlaylistUrl", (req, res) => {
  const playlistUrl = "http://localhost:3000/hls/stream.m3u8"; // Replace with the correct URL of your playlist
  res.json({ playlistUrl });
});

app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.flushHeaders();

  // Send the current playlist immediately upon connection
  const playlistPath = path.join(hlsOutputPath, "stream.m3u8");
  const playlistContent = fs.readFileSync(playlistPath, "utf-8");
  res.write(`data: ${playlistContent}\n\n`);

  // Keep the connection open and add the client to the list
  clients.push(res);

  // Remove the client from the list when the connection is closed
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

const server = app.listen(8000, () => {
  console.log("Server listening on port 8000");
});


