const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const NodeWebcam = require('node-webcam');
const rtsp = require('rtsp-server');
const cors = require('cors');

const app = express();
app.use(cors());
const outputPath = "/Users/ezeejain/Desktop/Lens_View/IP_NEW/ip-cameras/output";
const hlsOutputPath = "/Users/ezeejain/Desktop/Lens_View/IP_NEW/ip-cameras/hls";
// const rtspOutputUrl = "rtsp://localhost:8554/live/stream";
let captureInterval;

function stopCaptureInterval() {
  clearInterval(captureInterval);
}

export default function handler(req, res) {
  if (req.method === "POST" && !req.body.rtspUrl) {
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

        if (!fs.existsSync(outputPath)) {
          console.log("no such directry");
          stopCaptureInterval(); // Stop the interval when an error occurs
        }

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
          stopCaptureInterval(); // Stop the interval when an error occurs
        }
      });
    }

    function transcodeToHLS() {
      // LIVE
      const inputPattern = path.join(outputPath, 'output_%d.jpg');
      const frameRate = 3;
      const frameDuration = 1;
      const numFrames = Math.floor(frameRate * frameDuration);
      const startNumber = frameCount - numFrames >= 0 ? frameCount - numFrames * 1 : 0;

      const commonArgs = [
        "-y",
        "-start_number",
        startNumber,
        "-framerate",
        frameRate.toString(),
        "-i",
        inputPattern,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-b:v",
        "2000k",
        "-f",
        "hls",
        "-hls_time",
        "0",
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

    // function convertHLSToMP4() {
    //   const mp4OutputPath = path.join(hlsOutputPath, "output.mp4");
    
    //   const ffmpegArgs = [
    //     "-y",
    //     "-i",
    //     path.join(hlsOutputPath, "stream.m3u8"),
    //     "-c",
    //     "copy",
    //     mp4OutputPath,
    //   ];
    
    //   const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);
    
    //   ffmpegProcess.stdout.on("data", (data) => {
    //     console.log(`FFmpeg output: ${data}`);
    //   });
    
    //   ffmpegProcess.stderr.on("data", (data) => {
    //     console.error(`FFmpeg error: ${data}`);
    //   });
    
    //   ffmpegProcess.on("exit", () => {
    //     console.log("MP4 conversion completed");
    
    //     // Start HLS conversion again
    //     setTimeout(transcodeToHLS, 100);
    //   });
    // }

    setInterval(() => {
      if (framePaths.length > 0) {
        transcodeToHLS();
      }
    }, 1000);

    //handling RTSP requests
    app.use(express.static(hlsOutputPath));

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    captureInterval = setInterval(captureFrame, 1000);

    if (!fs.existsSync(hlsOutputPath)) {
      fs.mkdirSync(hlsOutputPath);
    }

    // Delay the HLS conversion process to ensure frames are available
    setTimeout(transcodeToHLS, 100);

    const port = 3001;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });


    res.status(200).json({ message: 'Straem converted by WebCam', streamUrl: "http://localhost:3001/stream.m3u8" });
  } else {
    // res.status(500).json({ message: 'Internal Server Error' });   
    let RTSP_URL = req.body.rtspUrl;

    const server = rtsp.createServer((req, res) => {
      console.log(req.method, req.url);

      switch (req.method) {
        case 'OPTIONS':
          res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP, PLAY');
          res.end();
          break;
        case 'DESCRIBE':
          const sdp = generateSdp();
          res.setHeader('Content-Type', 'application/sdp');
          res.setHeader('Content-Length', sdp.length);
          res.end(sdp);
          break;
        case 'SETUP':
          res.end();
          break;
        case 'PLAY':
          const videoStream = fs.createReadStream(path.join(hlsOutputPath, 'stream.m3u8'));
          videoStream.pipe(res);
          break;
        default:
          res.statusCode = 501;
          res.end();
      }
    });

    server.listen(8554, () => {
      console.log('RTSP server is running on port 8554');

      // Start the HLS conversion process
      convertToHLS(RTSP_URL);
    });

    function convertToHLS(rtspUrl) {
      // Create output directory if it doesn't exist
      if (!fs.existsSync(hlsOutputPath)) {
        fs.mkdirSync(hlsOutputPath);
      }

      const ffmpegArgs = [
        '-i', rtspUrl,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-b:v', '2000k',
        '-f', 'hls',
        '-hls_time', '2',
        '-hls_list_size', '5',
        '-hls_segment_filename', path.join(hlsOutputPath, 'output_%d.ts'),
        path.join(hlsOutputPath, 'stream.m3u8')
      ];

      const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

      ffmpegProcess.stdout.on('data', (data) => {
        console.log(`FFmpeg output: ${data}`);
      });

      ffmpegProcess.stderr.on('data', (data) => {
        console.error(`FFmpeg error: ${data}`);
      });

      ffmpegProcess.on('exit', (code) => {
        console.log(`FFmpeg process exited with code ${code}`);
      });
    }

    function generateSdp() {
      const sdp = `v=0\r
      o=- 0 0 IN IP4 127.0.0.1\r
      s=RTSP Server\r
      t=0 0\r
      c=IN IP4 127.0.0.1\r
      m=video 0 RTP/AVP 96\r
      a=rtpmap:96 H264/90000\r
      a=control:stream1\r
      a=range:npt=0-\r
      a=trackinfo:time=0 stream1=video stream2=audio\r`;

      return sdp;
    }

    res.status(200).json({ message: 'Stream converted by RTSP URL', streamUrl: "http://localhost:3001/stream.m3u8" });

  }
}