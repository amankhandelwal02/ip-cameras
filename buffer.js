// const { spawn } = require("child_process");

// // Define the FFmpeg command to stream the video
// const ffmpegCommand = [
//   "-re",
//   "-i",
//   "/Users/ezeejain/Downloads/test.mp4",
//   "-rtsp_transport",
//   "tcp",
//   "-c:v",
//   "copy",
//   "-c:a",
//   "aac",
//   "-f",
//   "rtsp",
//   "rtsp://localhost:8554/live/stream",
// ];

// // Spawn the FFmpeg process
// const ffmpegProcess = spawn("ffmpeg", ffmpegCommand);

// // Listen for FFmpeg process events
// ffmpegProcess.stdout.on("data", (data) => {
//   console.log(`FFmpeg stdout: ${data}`);
// });

// ffmpegProcess.stderr.on("data", (data) => {
//   console.error(`FFmpeg stderr: ${data}`);
// });

// ffmpegProcess.on("close", (code) => {
//   console.log(`FFmpeg process exited with code ${code}`);
// });

// // Handle process termination
// process.on("SIGINT", () => {
//   // Stop the FFmpeg process
//   ffmpegProcess.kill("SIGINT");
//   process.exit();
// });

// const { NodeRTSPServer } = require('node-rtsp-stream');

// const rtspServer = new NodeRTSPServer({
//   name: 'My RTSP Server',
//   streamUrl: '/Users/ezeejain/Downloads/test.mp4',
//   wsPort: 9999, // WebSocket port for MJPEG stream
//   rtspPort: 8554, // RTSP port
// });

// rtspServer.start();

const rtsp = require('rtsp-server');

const server = rtsp.createServer(function (req, res) {
  console.log(req.method, req.url);

  switch (req.method) {
    case 'OPTIONS':
      res.setHeader('Public', 'OPTIONS, DESCRIBE, SETUP');
      res.statusCode = 200;
      res.end();
      break;
    case 'DESCRIBE':
      // Provide the SDP data in the response
      const sdpData = 'v=0\n...'; // Replace with your SDP data
      res.setHeader('Content-Type', 'application/sdp');
      res.statusCode = 200;
      res.end(sdpData);
      break;
    case 'SETUP':
      // Handle the SETUP request (e.g., create a media session)
      // Provide the appropriate response headers
      res.setHeader('Transport', 'RTP/AVP;unicast;client_port=1234-1235');
      res.setHeader('Session', '12345678');
      res.statusCode = 200;
      res.end();
      break;
    default:
      res.statusCode = 501; // Not implemented
      res.end();
  }
});

server.listen(5000, function () {
  var port = server.address().port;
  console.log('RTSP server is running on port:', port);
});
