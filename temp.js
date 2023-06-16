// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');

// const app = express();
// const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.jpg';
// const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls/stream.m3u8';
// const rtspInputUrl = 'rtsp://localhost:8554/live/stream';

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

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);
//       captureFrame();
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Stream captured frames using FFmpeg and convert to RTSP
// function transcodeToRTSP() {
//   const ffmpegProcess = spawn('ffmpeg', [
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
//     rtspInputUrl,
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('RTSP streaming completed');
//   });
// }

// // Generate HLS files from the RTSP stream
// function transcodeToHLS() {
//   const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-i',
//     rtspInputUrl,
//     '-c:v',
//     'copy',
//     '-hls_time',
//     '2',
//     '-hls_list_size',
//     '10',
//     '-hls_wrap',
//     '10',
//     '-start_number',
//     '1',
//     '-hls_segment_filename',
//     path.join(hlsOutputPath, 'segment_%03d.ts'),
//     path.join(hlsOutputPath, 'stream.m3u8'),
//   ]);

//   ffmpegProcess.on('exit', () => {
//     console.log('HLS conversion completed');
//   });
// }

// // Serve the HLS stream to the client
// app.use(express.static(hlsOutputPath));

// // Start capturing image frames
// if (!fs.existsSync(outputPath) && !fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(outputPath);
//   fs.mkdirSync(hlsOutputPath);
//   captureFrame();
// }

// // Start transcoding frames to RTSP
// transcodeToRTSP();

// // Start transcoding RTSP to HLS
// if (!fs.existsSync(hlsOutputPath)) {
//   fs.mkdirSync(hlsOutputPath);
//   transcodeToHLS();
// }

// // Start the server
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });











const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const NodeWebcam = require('node-webcam');
const rtsp = require('rtsp-server');

const app = express();
const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output';
const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls';
const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

const Webcam = NodeWebcam.create({
  device: 'FaceTime HD Camera',
  width: 1280,
  height: 720,
  quality: 80,
  delay: 0,
  output: 'jpeg',
  verbose: false,
});

let frameCount = 0;
let framePaths = [];

// Start capturing and saving image frames
function captureFrame() {
  const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      console.log("Image captured:", data);
      framePaths.push(filePath);
      frameCount++;
      console.log("Frame count:", frameCount);
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

// Stream captured frames using FFmpeg and convert to HLS
function transcodeToHLS() {
  const ffmpegProcess = spawn('ffmpeg', [
    '-y',
    '-framerate',
    '1',
    '-i',
    path.join(outputPath, 'output_%d.jpg'),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-f',
    'hls',
    '-hls_time',
    '2',
    '-hls_list_size',
    '10',
    '-hls_wrap',
    '10',
    '-start_number',
    '1',
    path.join(hlsOutputPath, 'stream.m3u8'),
  ]);

  ffmpegProcess.on('exit', () => {
    console.log('HLS conversion completed');
  });
}

// Serve the HLS stream to handle RTSP requests
app.use(express.static(hlsOutputPath));

// Start capturing image frames
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

setInterval(captureFrame, 1000);

// Start streaming frames via RTSP
const ffmpegProcess = spawn('ffmpeg', [
  '-y',
  '-framerate',
  '1',
  '-i',
  path.join(outputPath, 'output_%d.jpg'),
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-f',
  'rtsp',
  rtspOutputUrl,
]);

ffmpegProcess.on('exit', () => {
  console.log('RTSP streaming completed:', rtspOutputUrl);
});

// Start transcoding frames to HLS
if (!fs.existsSync(hlsOutputPath)) {
  fs.mkdirSync(hlsOutputPath);
}
transcodeToHLS();

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Start RTSP server
const server = rtsp.createServer(function (req, res) {
  console.log(req.method, req.url);

  switch (req.method) {
    case 'OPTIONS':
      res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
      res.end();
      break;
    case 'DESCRIBE':
      var sdp = generateSdp();
      res.setHeader('Content-Type', 'application/sdp');
      res.setHeader('Content-Length', sdp.length);
      res.end(sdp);
      break;
    case 'SETUP':
      // Handle SETUP request if needed
      res.end();
      break;
    case 'PLAY':
      var videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
      videoStream.pipe(res);
      break;
    default:
      res.statusCode = 501;
      res.end();
  }
});

server.listen(8554, function () {
  var port = server.address().port;
  console.log('RTSP server is running on port:', port);
});

function generateSdp() {
  var sdp = 'v=0\r\n';
  sdp += 'o=- 0 0 IN IP4 127.0.0.1\r\n';
  sdp += 's=RTSP Server\r\n';
  sdp += 't=0 0\r\n';
  sdp += 'c=IN IP4 127.0.0.1\r\n';
  sdp += 'm=video 0 RTP/AVP 96\r\n';
  sdp += 'a=rtpmap:96 H264/90000\r\n';
  sdp += 'a=control:stream1\r\n';
  return sdp;
}


























// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');
// const rtsp = require('rtsp-server');

// const app = express();
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

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Stream captured frames using FFmpeg and convert to HLS
// function transcodeToHLS() {
//   const ffmpegProcess = spawn('ffmpeg', [
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
//   });
// }

// // Serve the HLS stream to handle RTSP requests
// app.use(express.static(hlsOutputPath));

// // Start capturing image frames
// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath);
// }

// setInterval(captureFrame, 1000);

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
//   transcodeToHLS();
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















// const express = require("express");
// const app = express();
// const NodeWebcam = require("node-webcam");
// const { spawn } = require("child_process");
// const WebSocket = require("ws");
// const RtspServer = require("node-rtsp-stream");

// // Configure webcam
// const Webcam = NodeWebcam.create({
//   device: "FaceTime HD Camera",
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: "jpeg",
//   verbose: false,
// });

// // WebSocket server for streaming
// const wss = new WebSocket.Server({ port: 8080 });

// // Capture and stream frames
// function captureAndStream() {
//   const filePath = "./output/output.jpg";

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       // Stream the captured frame to connected clients
//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(data);
//         }
//       });

//       // Capture and stream the next frame
//       captureAndStream();
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Convert captured frames to RTSP stream using FFmpeg
// function convertToRtspStream() {
//   const ffmpegProcess = spawn("ffmpeg", [
//     "-y",
//     "-loop",
//     "1",
//     "-i",
//     "./output/output.jpg",
//     "-c:v",
//     "libx264",
//     "-preset",
//     "ultrafast",
//     "-tune",
//     "zerolatency",
//     "-vf",
//     "fps=30",
//     "-f",
//     "rtsp",
//     "rtsp://localhost:8554/live/stream",
//   ]);

//   ffmpegProcess.on("exit", () => {
//     console.log("RTSP streaming completed");
//   });
// }

// // Start capturing and streaming frames
// captureAndStream();
// convertToRtspStream();

// // Serve the RTSP stream page
// app.get("/", (req, res) => {
//   res.send(`
//     <script src="https://cdn.jwplayer.com/libraries/dzVwUqoA.js"></script>
//     <div id="player"></div>
//     <script>
//       jwplayer("player").setup({
//         file: "rtsp://localhost:8554/live/stream",
//         type: "rtmp/mp4",
//         autostart: true,
//         width: "640",
//         height: "360",
//       });
//     </script>
//   `);
// });

// // Start the server
// const server = app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

// // Start the RTSP server
// const rtspServer = new RtspServer({
//   serverPort: 8554,
//   clientPort: 8000,
// });
// rtspServer.start();
