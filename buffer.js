const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const NodeWebcam = require('node-webcam');

const app = express();
const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.jpg';
const hlsOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/hls/stream.m3u8';
const rtspInputUrl = 'rtsp://localhost:8554/live/stream';

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
      captureFrame();
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

// Stream captured frames using FFmpeg and convert to RTSP
function transcodeToRTSP() {
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
    rtspInputUrl,
  ]);

  ffmpegProcess.on('exit', () => {
    console.log('RTSP streaming completed');
  });
}

// Generate HLS files from the RTSP stream
function transcodeToHLS() {
  const ffmpegProcess = spawn('ffmpeg', [
    '-y',
    '-i',
    rtspInputUrl,
    '-c:v',
    'copy',
    '-hls_time',
    '2',
    '-hls_list_size',
    '10',
    '-hls_wrap',
    '10',
    '-start_number',
    '1',
    '-hls_segment_filename',
    path.join(hlsOutputPath, 'segment_%03d.ts'),
    path.join(hlsOutputPath, 'stream.m3u8'),
  ]);

  ffmpegProcess.on('exit', () => {
    console.log('HLS conversion completed');
  });
}

// Serve the HLS stream to the client
app.use(express.static(hlsOutputPath));

// Start capturing image frames
if (!fs.existsSync(outputPath) && !fs.existsSync(hlsOutputPath)) {
  fs.mkdirSync(outputPath);
  fs.mkdirSync(hlsOutputPath);
  captureFrame();
}

// Start transcoding frames to RTSP
transcodeToRTSP();

// Start transcoding RTSP to HLS
if (!fs.existsSync(hlsOutputPath)) {
  fs.mkdirSync(hlsOutputPath);
  transcodeToHLS();
}

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});









// const mediasoup = require('mediasoup');
// const fs = require('fs');
// const { Readable } = require('stream');

// const videoFilePath = '/Users/ezeejain/Downloads/IMG_2297.MOV'; // Set the path to your video file
// const rtspUrl = 'rtsp://127.0.0.1:8554/live/stream'; // Modify the RTSP stream URL as needed

// async function startServer() {
//   try {
//     const worker = await mediasoup.createWorker({
//       logLevel: 'warn',
//       rtcMinPort: 40000,
//       rtcMaxPort: 49999
//     });

//     const router = await worker.createRouter({
//       mediaCodecs: [
//         {
//           kind: 'video',
//           mimeType: 'video/H264',
//           clockRate: 90000,
//           parameters: {
//             'packetization-mode': 1,
//             'profile-level-id': '42e01f',
//             'level-asymmetry-allowed': 1
//           },
//           payloadType: 100 // Specify the payloadType for the video codec
//         }
//       ]
//     });

//     const transport = await router.createPlainTransport({
//       listenIp: '127.0.0.1',
//       rtcpMux: true
//     });

//     const rtpCapabilities = router.rtpCapabilities;

//     const videoStream = createVideoStream(videoFilePath);

//     await transport.produce({
// //       kind: 'video',
// //       rtpParameters: {
// //         mid: 'video',
// //         codecs: [
// //           {
// //             ...rtpCapabilities.codecs[0],
// //             payloadType: 100 // Specify the payloadType for the video codec
// //           }
// //         ],
// //         encodings: [{ ssrc: 1001 }]
// //       },
// //       paused: false,
// //       appData: { mediaTag: 'video' },
// //       stream: videoStream
// //     });

// //     console.log('Video streaming via RTSP started successfully');
// //   } catch (error) {
// //     console.error('Error:', error);
// //   }
// // }

// // // function createVideoStream(videoFilePath) {
// // //   const videoStream = fs.createReadStream(videoFilePath);
// // //   const readable = new Readable();
// // //   readable._read = () => {};
// // //   readable.push(null);

// // //   videoStream.on('data', (chunk) => {
// // //     readable.push(chunk);
// // //   });

// // //   videoStream.on('end', () => {
// // //     readable.push(null);
// // //   });

// // //   return readable;
// // // }

// // function createVideoStream(videoFilePath) {
// //   const videoStream = fs.createReadStream(videoFilePath);

// //   videoStream.on('error', (error) => {
// //     console.error('Error reading video file:', error);
// //   });

// //   return videoStream;
// // }

// // startServer();



// // const mediasoup = require('mediasoup');
// // const fs = require('fs');
// // const { Readable } = require('stream');
// // const { spawn } = require('child_process');

// // const videoFilePath = '/home/aman/Desktop/workspace/ip_cameras/output/earth.mp4'; // Set the path to your video file
// // const rtspUrl = 'rtsp://127.0.0.1:8554/live/stream'; // Modify the RTSP stream URL as needed

// // async function startServer() {
// //   try {
// //     const worker = await mediasoup.createWorker({
// //       logLevel: 'warn',
// //       rtcMinPort: 40000,
// //       rtcMaxPort: 49999,
// //     });

// //     const router = await worker.createRouter({
// //       mediaCodecs: [
// //         {
// //           kind: 'video',
// //           mimeType: 'video/H264',
// //           clockRate: 90000,
// //           parameters: {
// //             'packetization-mode': 1,
// //             'profile-level-id': '42e01f',
// //             'level-asymmetry-allowed': 1,
// //           },
// //           payloadType: 100, // Specify the payloadType for the video codec
// //         },
// //       ],
// //     });

// //     const transport = await router.createPlainTransport({
// //       listenIp: '10.5.50.74',
// //       rtcpMux: true,
// //     });

// //     const rtpCapabilities = router.rtpCapabilities;

// //     const videoStream = createVideoStream(videoFilePath);

// //     await transport.produce({
// //       kind: 'video',
// //       rtpParameters: {
// //         mid: 'video',
// //         codecs: [
// //           {
// //             ...rtpCapabilities.codecs[0],
// //             payloadType: 100, // Specify the payloadType for the video codec
// //           },
// //         ],
// //         encodings: [{ ssrc: 1001 }],
// //       },
// //       paused: false,
// //       appData: { mediaTag: 'video' },
// //       stream: videoStream,
// //     });

// //     console.log('Video streaming via RTSP started successfully');

// //     // Spawn the RTSP server process
// //     const rtspServer = spawn('ffmpeg', [
// //       '-re',
// //       '-stream_loop',
// //       '-1',
// //       '-i',
// //       videoFilePath,
// //       '-vcodec',
// //       'copy',
// //       '-an',
// //       '-f',
// //       'rtsp',
// //       rtspUrl,
// //     ]);

// //     rtspServer.unref();

// //     rtspServer.stderr.on('data', (data) => {
// //       console.error('RTSP server error:', data.toString());
// //     });

// //     rtspServer.on('error', (error) => {
// //       console.error('RTSP server error:', error);
// //     });

// //     rtspServer.on('exit', (code) => {
// //       console.log('RTSP server process exited with code:', code);
// //     });

// //     process.on('exit', () => {
// //       rtspServer.kill();
// //     });
// //   } catch (error) {
// //     console.error('Error:', error);
// //   }
// // }

// // function createVideoStream(videoFilePath) {
// //   const videoStream = fs.createReadStream(videoFilePath);

// //   videoStream.on('error', (error) => {
// //     console.error('Error reading video file:', error);
// //   });

// //   return videoStream;
// // }

// // startServer();

// const mediasoup = require('mediasoup');
// const fs = require('fs');
// const { Readable } = require('stream');
// const { spawn } = require('child_process');

// const videoFilePath = '/home/aman/Desktop/workspace/ip_cameras/output/earth.mp4'; // Set the path to your video file
// const rtspUrl = 'rtsp://127.0.0.1:8554/live/stream'; // Modify the RTSP stream URL as needed

// async function startServer() {
//   try {
//     const worker = await mediasoup.createWorker({
//       logLevel: 'warn',
//       rtcMinPort: 40000,
//       rtcMaxPort: 49999,
//     });

//     const router = await worker.createRouter({
//       mediaCodecs: [
//         {
//           kind: 'video',
//           mimeType: 'video/H264',
//           clockRate: 90000,
//           parameters: {
//             'packetization-mode': 1,
//             'profile-level-id': '42e01f',
//             'level-asymmetry-allowed': 1,
//           },
//           payloadType: 100, // Specify the payloadType for the video codec
//         },
//       ],
//     });

//     const transport = await router.createPlainTransport({
//       listenIp: '127.0.0.1', // Use the IP address where the RTSP server is running
//       rtcpMux: true,
//     });

//     const rtpCapabilities = router.rtpCapabilities;

//     const videoStream = createVideoStream(videoFilePath);

//     const videoProducer = await transport.produce({
//       kind: 'video',
//       rtpParameters: {
//         mid: 'video',
//         codecs: [
//           {
//             ...rtpCapabilities.codecs[0],
//             payloadType: 100, // Specify the payloadType for the video codec
//           },
//         ],
//         encodings: [{ ssrc: 1001 }],
//       },
//       paused: false,
//       appData: { mediaTag: 'video' },
//       stream: videoStream,
//     });

//     console.log('Video streaming via RTSP started successfully');

//     // Spawn the RTSP server process
//     const rtspServer = spawn('ffmpeg', [
//       '-re',
//       '-i',
//       '-',
//       '-vcodec',
//       'copy',
//       '-an',
//       '-f',
//       'rtsp',
//       rtspUrl,
//     ]);

//     videoProducer.on('score', (score) => {
//       // Check the score to monitor the video streaming quality
//       console.log('Video Producer Score:', score);
//     });

//     videoProducer.observer.on('close', () => {
//       // Handle the video producer close event
//       console.log('Video Producer Closed');
//     });

//     videoStream.pipe(rtspServer.stdin);

//     rtspServer.stderr.on('data', (data) => {
//       console.error('RTSP server error:', data.toString());
//     });

//     rtspServer.on('error', (error) => {
//       console.error('RTSP server error:', error);
//     });

//     rtspServer.on('exit', (code) => {
//       console.log('RTSP server process exited with code:', code);
//     });

//     process.on('exit', () => {
//       rtspServer.kill();
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     process.exit(1); // Exit the process if there's an error during server initialization
//   }
// }

// function createVideoStream(videoFilePath) {
//   const videoStream = fs.createReadStream(videoFilePath);

//   videoStream.on('error', (error) => {
//     console.error('Error reading video file:', error);
//     process.exit(1); // Exit the process if there's an error reading the video file
//   });

//   return videoStream;

