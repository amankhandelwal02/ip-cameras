import { clearInterval } from 'timers';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const NodeWebcam = require('node-webcam');
const rtsp = require('rtsp-server');
const cors = require('cors'); 

const app = express();
app.use(cors());
const outputPath = "/home/aman/Desktop/workspace/ip_cameras/output";
const hlsOutputPath = "/home/aman/Desktop/workspace/ip_cameras/hls";
// const rtspOutputUrl = "rtsp://localhost:8554/live/stream";
let captureInterval;

export default function handler(req, res) {
  if (req.method === "POST" && req.body && req.body.rtspUrl) {

    let RTSP_URL = req.body.rtspUrl;
    console.log("RTSP_URL", RTSP_URL)

    const Webcam = NodeWebcam.create({
      device: "/dev/video0",
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

          if (!isTranscoding) {
            isTranscoding = true;
            transcodeToHLS();
          }
        } else {
          console.log("Error capturing image:", err);
          clearInterval(captureInterval)
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

    // Start streaming frames via RTSP
    const ffmpegProcess = spawn("ffmpeg", [
      "-y",
      "-framerate",
      "3",
      "-i",
      path.join(outputPath, "output_%d.jpg"),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-f",
      "rtsp",
      RTSP_URL,
    ]);

    ffmpegProcess.on("exit", () => {
      console.log("RTSP streaming completed:", RTSP_URL);
    });

    if (!fs.existsSync(hlsOutputPath)) {
      fs.mkdirSync(hlsOutputPath);
    }

    // Delay the HLS conversion process to ensure frames are available
    setTimeout(transcodeToHLS, 100);

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
    res.status(200).json({ message: 'API endpoint is working!', streamUrl: "http://localhost:3001/stream.m3u8" });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}