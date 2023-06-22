const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const NodeWebcam = require('node-webcam');
const rtsp = require('rtsp-server');
const cors = require('cors'); 

const app = express();
app.use(express.json()); 

app.get('/stream', (req, res) => {
  const data = req.body;
  console.log('Received data from frontend:', data);
  const responseData = { message: 'Data received successfully' };
  res.json(responseData);
});

app.use(cors()); 
const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip_cameras/output';
const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip_cameras/hls';
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
let isTranscoding = false; 


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

// Streaming captured frames using FFmpeg and convert to HLS
function transcodeToHLS() {
  const inputPattern = path.join(outputPath, 'output_%d.jpg');
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
    "5",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    path.join(hlsOutputPath, "output_%d.ts"),
    "-hls_flags",
    "append_list+omit_endlist",
    path.join(hlsOutputPath, "stream.m3u8"),
  ]);
  ffmpegProcess.on('exit', () => {
    console.log('HLS conversion completed');
    isTranscoding = false;
  });
}

//handling RTSP requests
app.use(express.static(hlsOutputPath));


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
  sdp += 'a=range:npt=0-\r\n'; // Include this line to indicate that the stream is continuous
  sdp += 'a=trackinfo:time=0 stream1=video stream2=audio\r\n'; // Include metadata for the tracks
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











