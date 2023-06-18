const express = require('express');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const app = express();

const rtspUrl = 'rtsp://localhost:8554/stream1'; // Replace with your RTSP URL

app.get('/stream', (req, res) => {
  res.contentType('application/x-mpegURL');

  ffmpeg(rtspUrl)
    .inputOptions('-rtsp_transport', 'tcp')
    .outputOptions('-hls_time', '10', '-hls_list_size', '6', '-hls_wrap', '10')
    .outputOptions('-start_number', '1', '-hls_segment_filename', 'public/segments/stream%03d.ts')
    .output('public/playlist.m3u8')
    .on('end', () => {
      console.log('Streaming ready');
    })
    .run();
});

app.listen(5000, () => {
  console.log('Server running on port 3000');
});
