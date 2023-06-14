const { RTSPServer } = require('mediasoup-rtsp-server');

async function startRtspServer(videoStreamPath, rtspPort) {
  const rtspServer = new RTSPServer();

  await rtspServer.start({ port: rtspPort });

  rtspServer.on('newSession', (session) => {
    // Provide the video stream path to the new session
    session.start({ url: videoStreamPath });
  });
}

// Provide the path to the video stream and the desired RTSP server port
const videoStreamPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/stream.rtsp';
const rtspPort = 8554;

// Start the RTSP server and serve the video stream
startRtspServer(videoStreamPath, rtspPort);
