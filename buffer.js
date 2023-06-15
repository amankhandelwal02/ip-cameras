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

const rtsp = require('rtsp-server');
const fs = require('fs');

const videoPath = '/home/aman/Desktop/workspace/ip_cameras/output/earth.mp4'; // Replace with the path to your video file

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
      var videoStream = fs.createReadStream(videoPath);
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


