const mediasoup = require('mediasoup');

async function createMediasoupServer() {
  const worker = await mediasoup.createWorker();

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
      },
    ],
  });

  // Add any additional configurations or settings as needed

  return { worker, router };
}

// Create the MediaSoup server
const mediasoupServer = createMediasoupServer();
