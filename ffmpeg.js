const fs = require('fs');
const { exec } = require('child_process');

function convertImageToVideoStream(imagePath, outputVideoPath) {
  const ffmpegCommand = `ffmpeg -loop 1 -i ${imagePath} -vf "fps=30" -tune stillimage -c:v libx264 -pix_fmt yuv420p -f rtsp ${outputVideoPath}`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error converting image to video stream:', error);
    }
  });
}

// Provide the path to the image and output video path
const imagePath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/buffer.jpg';
const outputVideoPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/stream.rtsp';

// Convert the image to a video stream
convertImageToVideoStream(imagePath, outputVideoPath);
