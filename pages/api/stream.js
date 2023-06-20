// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const { spawn } = require("child_process");
// const NodeWebcam = require("node-webcam");
// const rtsp = require("rtsp-server");
// const cors = require("cors");
// const app = express();

// app.use(cors());


// const outputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output";
// const hlsOutputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls";
// const rtspOutputUrl = "rtsp://localhost:8554/live/stream";
// app.use(express.static(hlsOutputPath));

// const Webcam = NodeWebcam.create({
//   device: "FaceTime HD Camera",
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: "jpeg",
//   verbose: false,
// });

// let frameCount = 0;
// let framePaths = [];
// let isTranscoding = false;

// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);

//       if (!isTranscoding) {
//         isTranscoding = true;
//         transcodeToHLS();
//       }
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, "output_%d.jpg");

//   const ffmpegProcess = spawn("ffmpeg", [
//     "-y",
//     "-start_number",
//     frameCount - 10,
//     "-framerate",
//     "1",
//     "-i",
//     inputPattern,
//     "-c:v",
//     "libx264",
//     "-pix_fmt",
//     "yuv420p",
//     "-f",
//     "hls",
//     "-hls_time",
//     "2",
//     "-hls_list_size",
//     "10",
//     "-hls_segment_filename",
//     path.join(hlsOutputPath, "output_%d.ts"),
//     path.join(hlsOutputPath, "stream.m3u8"),
//   ]);

//   ffmpegProcess.on("exit", () => {
//     console.log("HLS conversion completed");
//     isTranscoding = false;
//   });
// }

// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000);

// const ffmpegProcess = spawn("ffmpeg", [
//   "-y",
//   "-framerate",
//   "1",
//   "-i",
//   path.join(outputPath, "output_%d.jpg"),
//   "-c:v",
//   "libx264",
//   "-pix_fmt",
//   "yuv420p",
//   "-f",
//   "rtsp",
//   rtspOutputUrl,
// ]);

// ffmpegProcess.on("exit", () => {
//   console.log("RTSP streaming completed:", rtspOutputUrl);
// });

// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
// }




// const server = app.listen(8000, () => {
//   console.log("Server listening on port 8000");
// });









// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const { spawn } = require("child_process");
// const NodeWebcam = require("node-webcam");
// const rtsp = require("rtsp-server");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const outputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output";
// const hlsOutputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls";
// const rtspOutputUrl = "rtsp://localhost:8554/live/stream";

// const Webcam = NodeWebcam.create({
//   device: "FaceTime HD Camera",
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: "jpeg",
//   verbose: false,
// });

// let frameCount = 0;
// let framePaths = [];
// let isTranscoding = false;

// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);

//       if (!isTranscoding) {
//         isTranscoding = true;
//         transcodeToHLS();
//       }
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, "output_%d.jpg");

//   const ffmpegProcess = spawn("ffmpeg", [
//     "-y",
//     "-start_number",
//     frameCount - 10,
//     "-framerate",
//     "1",
//     "-i",
//     inputPattern,
//     "-c:v",
//     "libx264",
//     "-pix_fmt",
//     "yuv420p",
//     "-f",
//     "hls",
//     "-hls_time",
//     "2",
//     "-hls_list_size",
//     "10",
//     "-hls_segment_filename",
//     path.join(hlsOutputPath, "output_%d.ts"),
//     path.join(hlsOutputPath, "stream.m3u8"),
//   ]);

//   ffmpegProcess.on("exit", () => {
//     console.log("HLS conversion completed");
//     isTranscoding = false;
//   });
// }

// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000);

// const ffmpegProcess = spawn("ffmpeg", [
//   "-y",
//   "-framerate",
//   "1",
//   "-i",
//   path.join(outputPath, "output_%d.jpg"),
//   "-c:v",
//   "libx264",
//   "-pix_fmt",
//   "yuv420p",
//   "-f",
//   "rtsp",
//   rtspOutputUrl,
// ]);

// ffmpegProcess.on("exit", () => {
//   console.log("RTSP streaming completed:", rtspOutputUrl);
// });

// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
// }

// setTimeout(transcodeToHLS, 2000);

// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const server = rtsp.createServer(function (req, res) {
//   console.log(req.method, req.url);

//   switch (req.method) {
//     case "OPTIONS":
//       res.setHeader("Public", "OPTIONS, DESCRIBE, SETUP, PLAY");
//       res.end();
//       break;
//     case "DESCRIBE":
//       var sdp = generateSdp();
//       res.setHeader("Content-Type", "application/sdp");
//       res.setHeader("Content-Length", sdp.length);
//       res.end(sdp);
//       break;
//     case "SETUP":
//       res.end();
//       break;
//     case "PLAY":
//       var videoStream = fs.createReadStream(
//         path.join(hlsOutputPath, "stream.m3u8")
//       );
//       videoStream.pipe(res);
//       break;
//     default:
//       res.statusCode = 501;
//       res.end();
//   }
// });

// server.listen(8554, function () {
//   var port = server.address().port;
//   console.log("RTSP server is running on port:", port);
// });

// function generateSdp() {
//   var sdp = "v=0\r\n";
//   sdp += "o=- 0 0 IN IP4 127.0.0.1\r\n";
//   sdp += "s=RTSP Server\r\n";
//   sdp += "t=0 0\r\n";
//   sdp += "c=IN IP4 127.0.0.1\r\n";
//   sdp += "m=video 0 RTP/AVP 96\r\n";
//   sdp += "a=rtpmap:96 H264/90000\r\n";
//   sdp += "a=control:stream1\r\n";
//   return sdp;
// }

// // Code for updating the playlist dynamically
// function updatePlaylist() {
//   const playlistPath = path.join(hlsOutputPath, 'stream.m3u8');
//   const playlistContent = fs.readFileSync(playlistPath, 'utf-8');

//   const newSegmentDuration = 8; // Example duration, replace with your own logic

//   const lines = playlistContent.trim().split('\n');

//   let totalDuration = 0;
//   lines.forEach((line) => {
//     if (line.startsWith('#EXTINF:')) {
//       const segmentDuration = parseFloat(line.split(':')[1]);
//       totalDuration += segmentDuration;
//     }
//   });

//   const targetDuration = 8; // Example target duration, replace with your own logic
//   if (totalDuration + newSegmentDuration > targetDuration) {
//     let updatedContent = lines.slice(2);
//     let removedDuration = 0;
//     while (totalDuration + newSegmentDuration > targetDuration) {
//       const line = updatedContent.shift();
//       if (line.startsWith('#EXTINF:')) {
//         const segmentDuration = parseFloat(line.split(':')[1]);
//         totalDuration -= segmentDuration;
//         removedDuration += segmentDuration;
//       }
//     }
//     console.log(`Removed ${removedDuration} seconds of content from the playlist`);
//     lines.splice(2, lines.length - 2, ...updatedContent);
//   }

//   const newSegmentEntry = `#EXTINF:${newSegmentDuration.toFixed(6)},\noutput_1.ts`;

//   let sequenceNumber = parseInt(lines[3].split(':')[1]);
//   sequenceNumber++;

//   lines.splice(3, 0, newSegmentEntry, `#EXT-X-MEDIA-SEQUENCE:${sequenceNumber}`);

//   const updatedPlaylistContent = lines.join('\n');

//   fs.writeFileSync(playlistPath, updatedPlaylistContent, 'utf-8');
//   console.log('Playlist updated successfully');
// }

// setInterval(updatePlaylist, 10000); // Update the playlist every 5 seconds











//Update on refresh
const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const NodeWebcam = require("node-webcam");
const rtsp = require("rtsp-server");
const cors = require("cors"); // Import the cors package

const app = express();
app.use(cors()); // Enable CORS for all routes

const outputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output";
const hlsOutputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls";
const rtspOutputUrl = "rtsp://localhost:8554/live/stream";

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
let isTranscoding = false; // Track if transcoding is in progress

// Start capturing and saving image frames
function captureFrame() {
  const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      console.log("Image captured:", data);
      framePaths.push(filePath);
      frameCount++;
      console.log("Frame count:", frameCount);

      // Start transcoding frames to HLS if not already in progress
      if (!isTranscoding) {
        isTranscoding = true;
        transcodeToHLS();
      }
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

// Stream captured frames using FFmpeg and convert to HLS
function transcodeToHLS() {
  const inputPattern = path.join(outputPath, "output_%d.jpg");

  const ffmpegProcess = spawn("ffmpeg", [
    "-y",
    "-start_number",
    frameCount - 10, // Adjust the number of frames to include in the HLS stream
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
  });
}

// Serve the HLS stream to handle RTSP requests
app.use(express.static(hlsOutputPath));

// Start capturing image frames
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

setInterval(captureFrame, 1000); // Add this line to start capturing frames

// Start streaming frames via RTSP
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

// Start transcoding frames to HLS
if (!fs.existsSync(hlsOutputPath)) {
  fs.mkdirSync(hlsOutputPath);
}

// Delay the HLS conversion process to ensure frames are available
setTimeout(transcodeToHLS, 2000);

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Start RTSP server
const server = rtsp.createServer(function (req, res) {
  console.log(req.method, req.url);

  switch (req.method) {
    case "OPTIONS":
      res.setHeader("Public", "OPTIONS, DESCRIBE, SETUP, PLAY");
      res.end();
      break;
    case "DESCRIBE":
      var sdp = generateSdp();
      res.setHeader("Content-Type", "application/sdp");
      res.setHeader("Content-Length", sdp.length);
      res.end(sdp);
      break;
    case "SETUP":
      // Handle SETUP request if needed
      res.end();
      break;
    case "PLAY":
      var videoStream = fs.createReadStream(
        path.join(hlsOutputPath, "stream.m3u8")
      );
      videoStream.pipe(res);
      break;
    default:
      res.statusCode = 501;
      res.end();
  }
});

server.listen(8554, function () {
  var port = server.address().port;
  console.log("RTSP server is running on port:", port);
});

function generateSdp() {
  var sdp = "v=0\r\n";
  sdp += "o=- 0 0 IN IP4 127.0.0.1\r\n";
  sdp += "s=RTSP Server\r\n";
  sdp += "t=0 0\r\n";
  sdp += "c=IN IP4 127.0.0.1\r\n";
  sdp += "m=video 0 RTP/AVP 96\r\n";
  sdp += "a=rtpmap:96 H264/90000\r\n";
  sdp += "a=control:stream1\r\n";
  return sdp;
}









// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');
// const rtsp = require('rtsp-server');
// const cors = require('cors'); // Import the cors package

// const app = express();
// app.use(cors()); // Enable CORS for all routes

// const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output';
// const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls';
// const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

// const Webcam = NodeWebcam.create({
//   device: 'FaceTime HD Camera',
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: 'jpeg',
//   verbose: false,
// });

// let frameCount = 0;
// let framePaths = [];
// let isTranscoding = false; // Track if transcoding is in progress

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);

//       // Start transcoding frames to HLS if not already in progress
//       if (!isTranscoding) {
//         isTranscoding = true;
//         transcodeToHLS();
//       }
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Stream captured frames using FFmpeg and convert to HLS
// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, 'output_%d.jpg');

//   const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-start_number',
//     frameCount - 10, // Adjust the number of frames to include in the HLS stream
//     '-framerate',
//     '1',
//     '-i',
//     inputPattern,
//     '-c:v',
//     'libx264',
//     '-pix_fmt',
//     'yuv420p',
//     '-f',
//     'hls',
//     '-hls_time',
//     '2',
//     '-hls_list_size',
//     '10',
//     '-hls_segment_filename',
//     path.join(hlsOutputPath, 'output_%d.ts'),
//     path.join(hlsOutputPath, 'stream.m3u8'),
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('HLS conversion completed');
//     isTranscoding = false;

//     // Restart transcoding after completion
//     setTimeout(transcodeToHLS, 1000);
//   });
// }

// // Serve the HLS stream to handle RTSP requests
// app.use(express.static(hlsOutputPath));

// // Start capturing image frames
// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000); // Add this line to start capturing frames

// // Start streaming frames via RTSP
// const ffmpegProcess = spawn('ffmpeg', [
//   '-y',
//   '-framerate',
//   '1',
//   '-i',
//   path.join(outputPath, 'output_%d.jpg'),
//   '-c:v',
//   'libx264',
//   '-pix_fmt',
//   'yuv420p',
//   '-f',
//   'rtsp',
//   rtspOutputUrl,
// ]);

// ffmpegProcess.on('exit', () => {
//   console.log('RTSP streaming completed:', rtspOutputUrl);
// });

// // Start transcoding frames to HLS
// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
// }

// // Start the server
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // Start RTSP server
// const server = rtsp.createServer(function (req, res) {
//   console.log(req.method, req.url);

//   switch (req.method) {
//     case 'OPTIONS':
//       res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
//       res.end();
//       break;
//     case 'DESCRIBE':
//       var sdp = generateSdp();
//       res.setHeader('Content-Type', 'application/sdp');
//       res.setHeader('Content-Length', sdp.length);
//       res.end(sdp);
//       break;
//     case 'SETUP':
//       // Handle SETUP request if needed
//       res.end();
//       break;
//     case 'PLAY':
//       var videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
//       videoStream.pipe(res);
//       break;
//     default:
//       res.statusCode = 501;
//       res.end();
//   }
// });

// server.listen(8554, function () {
//   var port = server.address().port;
//   console.log('RTSP server is running on port:', port);
// });

// function generateSdp() {
//   var sdp = 'v=0\r\n';
//   sdp += 'o=- 0 0 IN IP4 127.0.0.1\r\n';
//   sdp += 's=RTSP Server\r\n';
//   sdp += 't=0 0\r\n';
//   sdp += 'c=IN IP4 127.0.0.1\r\n';
//   sdp += 'm=video 0 RTP/AVP 96\r\n';
//   sdp += 'a=rtpmap:96 H264/90000\r\n';
//   sdp += 'a=control:stream1\r\n';
//   return sdp;
// }














//Including api/routes

// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');
// const rtsp = require('rtsp-server');
// const cors = require('cors'); // Import the cors package

// const app = express();
// app.use(cors()); // Enable CORS for all routes

// // Create an empty array to store the frame URLs
// let frameUrls = [];

// // app.post('/api/stream', (req, res) => {
// //   // Access the data sent by the frontend
// //   const requestData = req.body;
// //   console.log("Data", req.body);

// //   // Process the data (e.g., store in database, perform calculations)
// //   const processedData = processedData(requestData);
// //   console.log("processedData", processedData);

// //   // Send a response back to the frontend
// //   res.status(200).json({ message: 'Data received successfully' });
// // });

// const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output';
// const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls';
// const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

// const Webcam = NodeWebcam.create({
//   device: 'FaceTime HD Camera',
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: 'jpeg',
//   verbose: false,
// });

// let frameCount = 0;
// let isTranscoding = false; // Track if transcoding is in progress

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       const frameUrl = `/frames/output_${frameCount}.jpg`;
//       frameUrls.push(frameUrl);
//       frameCount++;
//       console.log("Frame count:", frameCount);

//       // Start transcoding frames to HLS if not already in progress
//       if (!isTranscoding) {
//         isTranscoding = true;
//         transcodeToHLS();
//       }
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Stream captured frames using FFmpeg and convert to HLS
// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, 'output_%d.jpg');

//   const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-framerate',
//     '1',
//     '-i',
//     inputPattern,
//     '-c:v',
//     'libx264',
//     '-pix_fmt',
//     'yuv420p',
//     '-f',
//     'hls',
//     '-hls_time',
//     '2',
//     '-hls_list_size',
//     '10',
//     '-hls_segment_filename',
//     path.join(hlsOutputPath, 'output_%d.ts'),
//     path.join(hlsOutputPath, 'stream.m3u8'),
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('HLS conversion completed');
//     isTranscoding = false;
//   });
// }

// // Serve the HLS stream to handle RTSP requests
// app.use(express.static(hlsOutputPath));

// // Serve the captured frames as static files
// app.use('/frames', express.static(outputPath));

// // Start capturing image frames
// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000); // Add this line to start capturing frames

// // Start streaming frames via RTSP
// const ffmpegProcess = spawn('ffmpeg', [
//   '-y',
//   '-framerate',
//   '1',
//   '-i',
//   path.join(outputPath, 'output_%d.jpg'),
//   '-c:v',
//   'libx264',
//   '-pix_fmt',
//   'yuv420p',
//   '-f',
//   'rtsp',
//   rtspOutputUrl,
// ]);

// ffmpegProcess.on('exit', () => {
//   console.log('RTSP streaming completed:', rtspOutputUrl);
// });

// // Start transcoding frames to HLS
// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
// }

// // Delay the HLS conversion process to ensure frames are available
// setTimeout(transcodeToHLS, 2000);

// // Start the server
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // Start RTSP server
// const server = rtsp.createServer(function (req, res) {
//   console.log(req.method, req.url);

//   switch (req.method) {
//     case 'OPTIONS':
//       res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
//       res.end();
//       break;
//     case 'DESCRIBE':
//       var sdp = generateSdp();
//       res.setHeader('Content-Type', 'application/sdp');
//       res.setHeader('Content-Length', sdp.length);
//       res.end(sdp);
//       break;
//     case 'SETUP':
//       // Handle SETUP request if needed
//       res.end();
//       break;
//     case 'PLAY':
//       var videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
//       videoStream.pipe(res);
//       break;
//     default:
//       res.statusCode = 501;
//       res.end();
//   }
// });

// server.listen(8554, function () {
//   var port = server.address().port;
//   console.log('RTSP server is running on port:', port);
// });

// function generateSdp() {
//   var sdp = 'v=0\r\n';
//   sdp += 'o=- 0 0 IN IP4 127.0.0.1\r\n';
//   sdp += 's=RTSP Server\r\n';
//   sdp += 't=0 0\r\n';
//   sdp += 'c=IN IP4 127.0.0.1\r\n';
//   sdp += 'm=video 0 RTP/AVP 96\r\n';
//   sdp += 'a=rtpmap:96 H264/90000\r\n';
//   sdp += 'a=control:stream1\r\n';
//   return sdp;
// }













// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');
// const rtsp = require('rtsp-server');
// const cors = require('cors'); // Import the cors package

// const app = express();
// app.use(cors()); // Enable CORS for all routes

// app.post('/api/stream', (req, res) => {
//   // Access the data sent by the frontend
//   const requestData = req.body;
//   console.log("Data", req.body);

//   // Process the data (e.g., store in database, perform calculations)
//   const processedData = processedData(requestData);
//   console.log("processedData", processedData);

//   // Send a response back to the frontend
//   res.status(200).json({ message: 'Data received successfully' });
// });

// const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output';
// const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls';
// const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

// const Webcam = NodeWebcam.create({
//   device: 'FaceTime HD Camera',
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: 'jpeg',
//   verbose: false,
// });

// let frameCount = 0;
// let framePaths = [];
// let isTranscoding = false; // Track if transcoding is in progress

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);

//       // Start transcoding frames to HLS if not already in progress
//       if (!isTranscoding) {
//         isTranscoding = true;
//         transcodeToHLS();
//       }
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Stream captured frames using FFmpeg and convert to HLS
// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, 'output_%d.jpg');

//   const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-framerate',
//     '1',
//     '-i',
//     inputPattern,
//     '-c:v',
//     'libx264',
//     '-pix_fmt',
//     'yuv420p',
//     '-f',
//     'hls',
//     '-hls_time',
//     '2',
//     '-hls_list_size',
//     '10',
//     '-hls_segment_filename',
//     path.join(hlsOutputPath, 'output_%d.ts'),
//     path.join(hlsOutputPath, 'stream.m3u8'),
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('HLS conversion completed');
//     isTranscoding = false;
//   });
// }

// // Serve the HLS stream to handle RTSP requests
// app.use(express.static(hlsOutputPath));

// // Start capturing image frames
// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000); // Add this line to start capturing frames

// // Start streaming frames via RTSP
// const ffmpegProcess = spawn('ffmpeg', [
//   '-y',
//   '-framerate',
//   '1',
//   '-i',
//   path.join(outputPath, 'output_%d.jpg'),
//   '-c:v',
//   'libx264',
//   '-pix_fmt',
//   'yuv420p',
//   '-f',
//   'rtsp',
//   rtspOutputUrl,
// ]);

// ffmpegProcess.on('exit', () => {
//   console.log('RTSP streaming completed:', rtspOutputUrl);
// });

// // Start transcoding frames to HLS
// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
// }

// // Delay the HLS conversion process to ensure frames are available
// setTimeout(transcodeToHLS, 2000);

// // Start the server
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // Start RTSP server
// const server = rtsp.createServer(function (req, res) {
//   console.log(req.method, req.url);

//   switch (req.method) {
//     case 'OPTIONS':
//       res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
//       res.end();
//       break;
//     case 'DESCRIBE':
//       var sdp = generateSdp();
//       res.setHeader('Content-Type', 'application/sdp');
//       res.setHeader('Content-Length', sdp.length);
//       res.end(sdp);
//       break;
//     case 'SETUP':
//       // Handle SETUP request if needed
//       res.end();
//       break;
//     case 'PLAY':
//       var videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
//       videoStream.pipe(res);
//       break;
//     default:
//       res.statusCode = 501;
//       res.end();
//   }
// });

// server.listen(8554, function () {
//   var port = server.address().port;
//   console.log('RTSP server is running on port:', port);
// });

// function generateSdp() {
//   var sdp = 'v=0\r\n';
//   sdp += 'o=- 0 0 IN IP4 127.0.0.1\r\n';
//   sdp += 's=RTSP Server\r\n';
//   sdp += 't=0 0\r\n';
//   sdp += 'c=IN IP4 127.0.0.1\r\n';
//   sdp += 'm=video 0 RTP/AVP 96\r\n';
//   sdp += 'a=rtpmap:96 H264/90000\r\n';
//   sdp += 'a=control:stream1\r\n';
//   return sdp;
// }














// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');
// const rtsp = require('rtsp-server');
// const cors = require('cors'); // Import the cors package

// const app = express();
// app.use(cors()); // Enable CORS for all routes

// app.post('/api/stream', (req, res) => {
//   // Access the data sent by the frontend
//   const requestData = req.body;
// console.log("Data",requestData)
// });

// const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output';
// const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls';
// const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

// const Webcam = NodeWebcam.create({
//   device: 'FaceTime HD Camera',
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: 'jpeg',
//   verbose: false,
// });

// let frameCount = 0;
// let framePaths = [];
// let isTranscoding = false; // Track if transcoding is in progress

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);

//       // Start transcoding frames to HLS if not already in progress
//       if (!isTranscoding) {
//         isTranscoding = true;
//         transcodeToHLS();
//       }
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Stream captured frames using FFmpeg and convert to HLS
// // function transcodeToHLS() {
// //   const inputPattern = path.join(outputPath, 'output_%d.jpg');

// //   const ffmpegProcess = spawn('ffmpeg', [
// //     '-y',
// //     '-framerate',
// //     '1',
// //     '-i',
// //     inputPattern,
// //     '-c:v',
// //     'libx264',
// //     '-pix_fmt',
// //     'yuv420p',
// //     '-f',
// //     'hls',
// //     '-hls_time',
// //     '2',
// //     '-hls_list_size',
// //     '10',
// //     '-hls_wrap',
// //     '10',
// //     '-start_number',
// //     '1',
// //     path.join(hlsOutputPath, 'stream.m3u8'),
// //   ]);

// //   ffmpegProcess.on('exit', () => {
// //     console.log('HLS conversion completed');
// //     isTranscoding = false;
// //   });
// // }

// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, 'output_%d.jpg');

//   const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-framerate',
//     '1',
//     '-i',
//     inputPattern,
//     '-c:v',
//     'libx264',
//     '-pix_fmt',
//     'yuv420p',
//     '-f',
//     'hls',
//     '-hls_time',
//     '2',
//     '-hls_list_size',
//     '10',
//     '-hls_segment_filename',
//     path.join(hlsOutputPath, 'output_%d.ts'),
//     path.join(hlsOutputPath, 'stream.m3u8'),
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('HLS conversion completed');
//     isTranscoding = false;
//   });
// }

// // Serve the HLS stream to handle RTSP requests
// app.use(express.static(hlsOutputPath));

// // Start capturing image frames
// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000); // Add this line to start capturing frames

// // Start streaming frames via RTSP
// const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-framerate',
//     '1',
//     '-i',
//     path.join(outputPath, 'output_%d.jpg'),
//     '-c:v',
//     'libx264',
//     '-pix_fmt',
//     'yuv420p',
//     '-f',
//     'rtsp',
//     rtspOutputUrl,
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('RTSP streaming completed:', rtspOutputUrl);
//   });

// // Start transcoding frames to HLS
// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
// }

// // Delay the HLS conversion process to ensure frames are available
// setTimeout(transcodeToHLS, 2000);

// // Start the server
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // Start RTSP server
// const server = rtsp.createServer(function (req, res) {
//   console.log(req.method, req.url);

//   switch (req.method) {
//     case 'OPTIONS':
//       res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
//       res.end();
//       break;
//     case 'DESCRIBE':
//       var sdp = generateSdp();
//       res.setHeader('Content-Type', 'application/sdp');
//       res.setHeader('Content-Length', sdp.length);
//       res.end(sdp);
//       break;
//     case 'SETUP':
//       // Handle SETUP request if needed
//       res.end();
//       break;
//     case 'PLAY':
//       var videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
//       videoStream.pipe(res);
//       break;
//     default:
//       res.statusCode = 501;
//       res.end();
//   }
// });

// server.listen(8554, function () {
//   var port = server.address().port;
//   console.log('RTSP server is running on port:', port);
// });

// function generateSdp() {
//   var sdp = 'v=0\r\n';
//   sdp += 'o=- 0 0 IN IP4 127.0.0.1\r\n';
//   sdp += 's=RTSP Server\r\n';
//   sdp += 't=0 0\r\n';
//   sdp += 'c=IN IP4 127.0.0.1\r\n';
//   sdp += 'm=video 0 RTP/AVP 96\r\n';
//   sdp += 'a=rtpmap:96 H264/90000\r\n';
//   sdp += 'a=control:stream1\r\n';
//   return sdp;
// }

// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');
// const rtsp = require('rtsp-server');
// const cors = require('cors'); // Import the cors package

// const app = express();
// app.use(cors()); // Enable CORS for all routes
// const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output';
// const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls';
// const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

// const Webcam = NodeWebcam.create({
//   device: 'FaceTime HD Camera',
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: 'jpeg',
//   verbose: false,
// });

// let frameCount = 0;
// let framePaths = [];
// let isTranscoding = false; // Track if transcoding is in progress

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);

//       // Start transcoding frames to HLS if not already in progress
//       if (!isTranscoding) {
//         isTranscoding = true;
//         transcodeToHLS();
//       }
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Stream captured frames using FFmpeg and convert to HLS
// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, 'output_%d.jpg');

//   const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-framerate',
//     '1',
//     '-i',
//     inputPattern,
//     '-c:v',
//     'libx264',
//     '-pix_fmt',
//     'yuv420p',
//     '-f',
//     'hls',
//     '-hls_time',
//     '2',
//     '-hls_list_size',
//     '10',
//     '-hls_wrap',
//     '10',
//     '-start_number',
//     '1',
//     path.join(hlsOutputPath, 'stream.m3u8'),
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('HLS conversion completed');
//     isTranscoding = false;
//   });
// }

// // Serve the HLS stream to handle RTSP requests
// app.use(express.static(hlsOutputPath));

// // Start capturing image frames
// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000); // Add this line to start capturing frames

// // Start streaming frames via RTSP
// const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-framerate',
//     '1',
//     '-i',
//     path.join(outputPath, 'output_%d.jpg'),
//     '-c:v',
//     'libx264',
//     '-pix_fmt',
//     'yuv420p',
//     '-f',
//     'rtsp',
//     rtspOutputUrl,
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('RTSP streaming completed:', rtspOutputUrl);
//   });

// // Start transcoding frames to HLS
// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
// }

// // Delay the HLS conversion process to ensure frames are available
// setTimeout(transcodeToHLS, 2000);

// // Start the server
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // Start RTSP server
// const server = rtsp.createServer(function (req, res) {
//   console.log(req.method, req.url);

//   switch (req.method) {
//     case 'OPTIONS':
//       res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
//       res.end();
//       break;
//     case 'DESCRIBE':
//       var sdp = generateSdp();
//       res.setHeader('Content-Type', 'application/sdp');
//       res.setHeader('Content-Length', sdp.length);
//       res.end(sdp);
//       break;
//     case 'SETUP':
//       // Handle SETUP request if needed
//       res.end();
//       break;
//     case 'PLAY':
//       var videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
//       videoStream.pipe(res);
//       break;
//     default:
//       res.statusCode = 501;
//       res.end();
//   }
// });

// server.listen(8554, function () {
//   var port = server.address().port;
//   console.log('RTSP server is running on port:', port);
// });

// function generateSdp() {
//   var sdp = 'v=0\r\n';
//   sdp += 'o=- 0 0 IN IP4 127.0.0.1\r\n';
//   sdp += 's=RTSP Server\r\n';
//   sdp += 't=0 0\r\n';
//   sdp += 'c=IN IP4 127.0.0.1\r\n';
//   sdp += 'm=video 0 RTP/AVP 96\r\n';
//   sdp += 'a=rtpmap:96 H264/90000\r\n';
//   sdp += 'a=control:stream1\r\n';
//   return sdp;
// }
