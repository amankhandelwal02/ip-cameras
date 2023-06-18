const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const NodeWebcam = require('node-webcam');
const rtsp = require('rtsp-server');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(cors()); // Enable CORS for all routes
const outputPath = '/home/aman/Desktop/workspace/ip_cameras/output';
const hlsOutputPath = '/home/aman/Desktop/workspace/ip_cameras/hls';
const rtspOutputUrl = 'rtsp://localhost:8554/live/stream';

export default function handler(req, res) {

    const Webcam = NodeWebcam.create({
        device: '/dev/video0',
        width: 1280,
        height: 720,
        quality: 80,
        delay: 0,
        output: 'jpeg',
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
        const inputPattern = path.join(outputPath, 'output_%d.jpg');
      
        const ffmpegProcess = spawn('ffmpeg', [
          '-y',
          '-framerate',
          '1',
          '-i',
          inputPattern,
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
      
      

    res.status(200).json({ message: 'API endpoint is working!', streamUrl: "http://localhost:3001/stream.m3u8" });
}
