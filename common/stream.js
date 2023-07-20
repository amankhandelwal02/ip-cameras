const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const NodeWebcam = require("node-webcam");
const rtsp = require("rtsp-server");
const cors = require("cors");

const app = express();
app.use(express.json());

app.get("/stream", (req, res) => {
  const data = req.body;
  console.log("Received data from frontend:", data);
  const responseData = { message: "Data received successfully" };
  res.json(responseData);
});

app.use(cors());
const outputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip_cameras/output";
const hlsOutputPath = "/Users/ezeejain/Desktop/Lens_View/camera/ip_cameras/hls";
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
let isTranscoding = false;

function captureFrame() {
  const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      console.log("Image captured:", data);
      framePaths.push(filePath);
      frameCount++;
      console.log("Frame count:", frameCount);

      setInterval(() => {
      if (!isTranscoding && framePaths.length > 0) {
        isTranscoding = true;
        transcodeToHLS();
      }
    }, 1000);
     
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

// function transcodeToHLS() {
//   const inputPattern = path.join(outputPath, 'output_%d.jpg');
//   const commonArgs = [
//     "-y",
//     "-start_number",
//     // frameCount - 10,
//     2,
//     "-framerate",
//     "7",
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
//     "0",
//     "-hls_segment_filename",
//     path.join(hlsOutputPath, "output_%d.ts"),
//     "-hls_flags",
//     // "append_list+omit_endlist",
//     "append_list",
//     path.join(hlsOutputPath, "stream.m3u8"),
//   ];

//   const ffmpegArgs = commonArgs.concat([]);

//   const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

//   ffmpegProcess.on('exit', () => {
//     console.log('HLS conversion completed');
//     isTranscoding = false;
//     framePaths = []; // Clear the frame paths after conversion
//   });
// }

function transcodeToHLS() {
  //LIVE AND UPDATE
  const inputPattern = path.join(outputPath, 'output_%d.jpg');
  const frameRate = 3; 
  const frameDuration = 2; 
  const numFrames = Math.floor(frameRate * frameDuration) * 1 ;
  const startNumber = frameCount - numFrames * 2 >= 0 ? frameCount - numFrames  : 0;
  console.log("start_number", startNumber);

//LIVE
  // const inputPattern = path.join(outputPath, 'output_%d.jpg');
  // const frameRate = 1; 
  // const frameDuration = 2; 
  // const numFrames = Math.floor(frameRate * frameDuration);
  // const startNumber = frameCount - numFrames  >= 0 ? frameCount - numFrames * 1  : 0;
  // console.log("start_number", startNumber);


  //   const inputPattern = path.join(outputPath, 'output_%d.jpg');
  // const frameRate = 1; // Adjust the frame rate accordingly
  // const frameDuration = 2; // Duration of each frame in seconds
  // const numFrames = Math.floor(frameRate * frameDuration);
  // let startNumber = frameCount - (numFrames * 2); // Adjust the multiplication factor to control the playback speed
  // if (startNumber < 0) {
  //   startNumber = 0; // Ensure startNumber is not negative
  // }

  // const inputPattern = path.join(outputPath, "output_%d.jpg");
  // const frameRate = 1; 
  // const frameDuration = 2; 
  // const numFrames = Math.floor(frameRate * frameDuration);
  // let startNumber = frameCount - numFrames * 2; 
  // startNumber = startNumber >= 0 ? startNumber : 0; 



  const commonArgs = [
    "-y",
    "-start_number",
    startNumber.toString(),
    "-framerate",
    frameRate.toString(),
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
    "0",
    "-hls_segment_filename",
    path.join(hlsOutputPath, "output_%d.ts"),
    "-hls_flags",
    "append_list+omit_endlist",
    path.join(hlsOutputPath, "stream.m3u8"),
  ];

  const ffmpegArgs = commonArgs.concat([]);

  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

  ffmpegProcess.on("exit", () => {
    console.log("HLS conversion completed");
    isTranscoding = false;
    framePaths = []; 
  });
}

// setInterval(() => {
//   if (framePaths.length > 0) {
//     transcodeToHLS();
//   }
// }, 5000);

//handling RTSP requests
app.use(express.static(hlsOutputPath));

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

setInterval(captureFrame, 1000);

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

if (!fs.existsSync(hlsOutputPath)) {
  fs.mkdirSync(hlsOutputPath);
}

// Delay the HLS conversion process to ensure frames are available
setTimeout(transcodeToHLS, 1000);

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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
  sdp += "a=range:npt=0-\r\n";
  sdp += "a=trackinfo:time=0 stream1=video stream2=audio\r\n";
  return sdp;
}















// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const NodeWebcam = require('node-webcam');
// const rtsp = require('rtsp-server');

// const app = express();
// const outputPath = '/home/aman/Desktop/workspace/ip_cameras/output';
// const hlsOutputPath = '/home/aman/Desktop/workspace/ip_cameras/hls';
// const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

// const Webcam = NodeWebcam.create({
//   device: '/dev/video0',
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
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const outputPath = "/home/aman/Desktop/workspace/ip_cameras/output";
// const hlsOutputPath = "/home/aman/Desktop/workspace/ip_camerashls";
// let captureInterval;

// function stopCaptureInterval() {
//   clearInterval(captureInterval);
// }

// export default function handler(req, res) {
//   if (req.method === "POST" && !req.body.rtspUrl) {
//     const Webcam = NodeWebcam.create({
//       device: "/dev/video0",
//       width: 1280,
//       height: 720,
//       quality: 80,
//       delay: 0,
//       output: "jpeg",
//       verbose: false,
//     });

//     let frameCount = 0;
//     let framePaths = [];
//     let isTranscoding = false;

//     function captureFrame() {
//       const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

//       Webcam.capture(filePath, (err, data) => {
//         if (!fs.existsSync(outputPath)) {
//           console.log("no such directory");
//           stopCaptureInterval(); // Stop the interval when an error occurs
//         }

//         if (!err) {
//           console.log("Image captured:", data);
//           framePaths.push(filePath);
//           frameCount++;
//           console.log("Frame count:", frameCount);

//           if (!isTranscoding) {
//             isTranscoding = true;
//             transcodeToHLS();
//           }
//         } else {
//           console.log("Error capturing image:", err);
//           stopCaptureInterval(); // Stop the interval when an error occurs
//         }
//       });
//     }

//     function transcodeToHLS() {
//       const inputPattern = path.join(outputPath, 'output_%d.jpg');
//       const frameRate = 3;
//       const frameDuration = 1;
//       const numFrames = Math.floor(frameRate * frameDuration);
//       const startNumber = frameCount - numFrames >= 0 ? frameCount - numFrames * 1 : 0;

//       const commonArgs = [
//         "-y",
//         "-start_number",
//         startNumber,
//         "-framerate",
//         frameRate.toString(),
//         "-i",
//         inputPattern,
//         "-c:v",
//         "libx264",
//         "-pix_fmt",
//         "yuv420p",
//         "-b:v",
//         "2000k",
//         "-f",
//         "hls",
//         "-hls_time",
//         "0",
//         "-hls_list_size",
//         "0",
//         "-hls_segment_filename",
//         path.join(hlsOutputPath, "output_%d.ts"),
//         "-hls_flags",
//         "append_list+omit_endlist",
//         path.join(hlsOutputPath, "stream.m3u8"),
//       ];

//       const ffmpegArgs = commonArgs.concat([]);

//       const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

//       ffmpegProcess.on("exit", () => {
//         console.log("HLS conversion completed");
//         isTranscoding = false;
//         framePaths = [];
//       });
//     }

//     setInterval(() => {
//       if (framePaths.length > 0) {
//         transcodeToHLS();
//       }
//     }, 1000);

//     app.use(express.static(hlsOutputPath));

//     if (!fs.existsSync(outputPath)) {
//       fs.mkdirSync(outputPath);
//     }

//     captureInterval = setInterval(captureFrame, 1000);

//     if (!fs.existsSync(hlsOutputPath)) {
//       fs.mkdirSync(hlsOutputPath);
//     }

//     const port = 3001;
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });

//     res.status(200).json({
//       message: 'Stream converted by Webcam',
//       streamUrl: "http://localhost:3001/stream.m3u8",
//     });
//   } else {
//     let RTSP_URL = req.body.rtspUrl;

//     const server = rtsp.createServer((req, res) => {
//       console.log(req.method, req.url);

//       switch (req.method) {
//         case 'OPTIONS':
//           res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
//           res.end();
//           break;
//         case 'DESCRIBE':
//           const sdp = generateSdp();
//           res.setHeader('Content-Type', 'application/sdp');
//           res.setHeader('Content-Length', sdp.length);
//           res.end(sdp);
//           break;
//         case 'SETUP':
//           res.end();
//           break;
//         case 'PLAY':
//           const videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
//           videoStream.pipe(res);
//           break;
//         default:
//           res.statusCode = 501;
//           res.end();
//       }
//     });

//     server.listen(8554, () => {
//       console.log('RTSP server is running on port 8554');
//       convertToHLS(RTSP_URL);
//     });

//     function convertToHLS(rtspUrl) {
//       if (!fs.existsSync(hlsOutputPath)) {
//         fs.mkdirSync(hlsOutputPath);
//       }

//       const ffmpegArgs = [
//         '-i', rtspUrl,
//         '-c:v', 'libx264',
//         '-pix_fmt', 'yuv420p',
//         '-b:v', '2000k',
//         '-f', 'hls',
//         '-hls_time', '2',
//         '-hls_list_size', '5',
//         '-hls_segment_filename', path.join(hlsOutputPath, 'output_%d.ts'),
//         path.join(hlsOutputPath, 'stream.m3u8')
//       ];

//       const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

//       ffmpegProcess.stdout.on('data', (data) => {
//         console.log(`FFmpeg output: ${data}`);
//       });

//       ffmpegProcess.stderr.on('data', (data) => {
//         console.error(`FFmpeg error: ${data}`);
//       });

//       ffmpegProcess.on('exit', (code) => {
//         console.log(`FFmpeg process exited with code ${code}`);
//       });
//     }

//     function generateSdp() {
//       const sdp = `v=0\r
//       o=- 0 0 IN IP4 127.0.0.1\r
//       s=RTSP Server\r
//       t=0 0\r
//       c=IN IP4 127.0.0.1\r
//       m=video 0 RTP/AVP 96\r
//       a=rtpmap:96 H264/90000\r
//       a=control:stream1\r
//       a=range:npt=0-\r
//       a=trackinfo:time=0 stream1=video stream2=audio\r`;

//       return sdp;
//     }

//     res.status(200).json({
//       message: 'Stream converted by RTSP URL',
//       streamUrl: "http://localhost:3001/stream.m3u8",
//     });
//   }
// }
