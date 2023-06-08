const NodeWebcam = require('node-webcam');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const Webcam = NodeWebcam.create({
  device: '/dev/video0',
  width: 1280,
  height: 720,
  quality: 80,
  delay: 0,
  output: 'jpeg',
  verbose: false,
});

const outputPath = '/home/aman/Desktop/workspace/ip_cameras/output'; // Update with the desired output directory
const fps = 30; // Frames per second for the resulting video
const videoOutputPath = '/home/aman/Desktop/workspace/ip_cameras/output/output.mp4'; // Update with the desired video output path

const framesPerReset = 30; // Number of frames after which the capture will reset
let frameCount = 0;
let currentVideoDuration = 0;

// Start capturing and saving image frames
function captureFrame() {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath); // Create the 'output' directory if it doesn't exist
  }
  const filePath = path.join(outputPath, `output_${frameCount}.jpg`); // Use a unique file name for each frame

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      console.log('Image captured:', data);
      frameCount++;
      console.log('Frame count:', frameCount);

      // Check if the reset condition is met
      if (frameCount % framesPerReset === 0) {
        convertToVideo();
      } else {
        setTimeout(captureFrame, 1000 / fps); // Capture frames at the specified FPS
      }
    } else {
      console.log('Error capturing image:', err);
    }
  });
}

// Convert captured frames into an MP4 video and append to existing video
function convertToVideo() {
  const existingVideoPath = videoOutputPath;
  const newVideoPath = path.join(outputPath, 'new_video.mp4');

  const ffmpegProcess = spawn('ffmpeg', [
    '-y',
    '-framerate', `${fps}`,
    '-start_number', '0',
    '-i', path.join(outputPath, 'output_%d.jpg'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-vf', `pad=ceil(iw/2)*2:ceil(ih/2)*2,setsar=1`,
    '-t', '10', // Set the duration of the video to 10 seconds
    '-f', 'mp4',
    newVideoPath
  ]);

  ffmpegProcess.on('exit', () => {
    console.log('New video conversion completed:', newVideoPath);

    if (fs.existsSync(existingVideoPath)) {
      const concatProcess = spawn('ffmpeg', [
        '-y',
        '-i', `concat:${existingVideoPath}|${newVideoPath}`,
        '-c', 'copy',
        '-movflags', '+faststart',
        '-f', 'mp4',
        '-safe', '0',
        existingVideoPath
      ]);

      concatProcess.on('exit', () => {
        console.log('Video concatenation completed:', existingVideoPath);

        // Cleanup: Remove the captured image files and new video file
        for (let i = 0; i < frameCount; i++) {
          fs.unlinkSync(path.join(outputPath, `output_${i}.jpg`));
        }
        fs.unlinkSync(newVideoPath);

        frameCount = 0;

        // Restart the capture
        setTimeout(captureFrame, 1000 / fps);
      });
    } else {
      // If the existing video file doesn't exist, rename the new video file
      fs.renameSync(newVideoPath, existingVideoPath);

      // Restart the capture
      setTimeout(captureFrame, 1000 / fps);
    }
  });
}


// Start capturing image frames
captureFrame();
