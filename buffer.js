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
//       kind: 'video',
//       rtpParameters: {
//         mid: 'video',
//         codecs: [
//           {
//             ...rtpCapabilities.codecs[0],
//             payloadType: 100 // Specify the payloadType for the video codec
//           }
//         ],
//         encodings: [{ ssrc: 1001 }]
//       },
//       paused: false,
//       appData: { mediaTag: 'video' },
//       stream: videoStream
//     });

//     console.log('Video streaming via RTSP started successfully');
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// // function createVideoStream(videoFilePath) {
// //   const videoStream = fs.createReadStream(videoFilePath);
// //   const readable = new Readable();
// //   readable._read = () => {};
// //   readable.push(null);

// //   videoStream.on('data', (chunk) => {
// //     readable.push(chunk);
// //   });

// //   videoStream.on('end', () => {
// //     readable.push(null);
// //   });

// //   return readable;
// // }

// function createVideoStream(videoFilePath) {
//   const videoStream = fs.createReadStream(videoFilePath);

//   videoStream.on('error', (error) => {
//     console.error('Error reading video file:', error);
//   });

//   return videoStream;
// }

// startServer();

const mediasoup = require('mediasoup');
const fs = require('fs');
const { Readable } = require('stream');
const { spawn } = require('child_process');

const videoFilePath = '/Users/ezeejain/Downloads/test.mp4'; // Set the path to your video file
const rtspUrl = 'rtsp://127.0.0.1:8554/live/stream'; // Modify the RTSP stream URL as needed

async function startServer() {
  try {
    const worker = await mediasoup.createWorker({
      logLevel: 'warn',
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
    });

    const router = await worker.createRouter({
      mediaCodecs: [
        {
          kind: 'video',
          mimeType: 'video/H264',
          clockRate: 90000,
          parameters: {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
            'level-asymmetry-allowed': 1,
          },
          payloadType: 100, // Specify the payloadType for the video codec
        },
      ],
    });

    const transport = await router.createPlainTransport({
      listenIp: '192.168.11.102',
      rtcpMux: true,
    });

    const rtpCapabilities = router.rtpCapabilities;

    const videoStream = createVideoStream(videoFilePath);

    await transport.produce({
      kind: 'video',
      rtpParameters: {
        mid: 'video',
        codecs: [
          {
            ...rtpCapabilities.codecs[0],
            payloadType: 100, // Specify the payloadType for the video codec
          },
        ],
        encodings: [{ ssrc: 1001 }],
      },
      paused: false,
      appData: { mediaTag: 'video' },
      stream: videoStream,
    });

    console.log('Video streaming via RTSP started successfully');

    // Spawn the RTSP server process
    const rtspServer = spawn('ffmpeg', [
      '-re',
      '-stream_loop',
      '-1',
      '-i',
      videoFilePath,
      '-vcodec',
      'copy',
      '-an',
      '-f',
      'rtsp',
      rtspUrl,
    ]);

    rtspServer.unref();

    rtspServer.stderr.on('data', (data) => {
      console.error('RTSP server error:', data.toString());
    });

    rtspServer.on('error', (error) => {
      console.error('RTSP server error:', error);
    });

    rtspServer.on('exit', (code) => {
      console.log('RTSP server process exited with code:', code);
    });

    process.on('exit', () => {
      rtspServer.kill();
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function createVideoStream(videoFilePath) {
  const videoStream = fs.createReadStream(videoFilePath);

  videoStream.on('error', (error) => {
    console.error('Error reading video file:', error);
  });

  return videoStream;
}

startServer();
