
const NodeWebcam = require("node-webcam");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const Webcam = NodeWebcam.create({
  device: "FaceTime HD Camera",
  width: 1280,
  height: 720,
  quality: 80,
  delay: 0,
  output: "jpeg",
  verbose: false,
});

const outputPath =
  "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output"; // Update with the desired output directory
const videoOutputPath =
  "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.mp4"; // Update with the desired video output path

let frameCount = 0;
let framePaths = [];

// Start capturing and saving image frames
function captureFrame() {
  const filePath = path.join(outputPath, `output_${frameCount}.jpg`); // Use a unique file name for each frame

  Webcam.capture(filePath, (err, data) => {
    if (!err) {
      console.log("Image captured:", data);
      framePaths.push(filePath);
      frameCount++;
      console.log("Frame count:", frameCount);
      captureFrame(); // Capture the next frame
    } else {
      console.log("Error capturing image:", err);
    }
  });
}

// Convert captured frames into an MP4 video
function convertToVideo() {
  const ffmpegProcess = spawn("ffmpeg", [
    "-y",
    "-framerate",
    1, // Remove the -r option
    "-i",
    path.join(outputPath, "output_%d.jpg"),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-t",
    `${frameCount}`, // Set the duration of the video based on the number of frames captured
    videoOutputPath,
  ]);

  ffmpegProcess.on("exit", () => {
    console.log("Video conversion completed:", videoOutputPath);

    // Cleanup: Remove the captured image files
    for (const framePath of framePaths) {
      if (fs.existsSync(framePath)) {
        fs.unlinkSync(framePath);
      }
    }

    // Clear the frame count and paths to start capturing new frames
    frameCount = 0;
    framePaths = [];

    // Start capturing new frames
    captureFrame();
  });
}

  // Start capturing image frames
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
    captureFrame();
    }
  
  // Stop capturing frames and convert them into a video every 10 seconds
  setInterval(() => {
    Webcam.clear();
    convertToVideo();
  }, 10000); // Convert frames to video every 10 seconds (adjust the duration as needed)













































  // const NodeWebcam = require("node-webcam");
// const fs = require("fs");
// const path = require("path");
// const { spawn } = require("child_process");

// const Webcam = NodeWebcam.create({
//   device: "FaceTime HD Camera",
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: "jpeg",
//   verbose: false,
// });

// const outputPath =
//   "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output"; // Update with the desired output directory
// const videoOutputPath =
//   "/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.mp4"; // Update with the desired video output path

// let frameCount = 0;
// let framePaths = [];

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`); // Use a unique file name for each frame

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log("Image captured:", data);
//       framePaths.push(filePath);
//       frameCount++;
//       console.log("Frame count:", frameCount);
//       captureFrame(); // Capture the next frame
//     } else {
//       console.log("Error capturing image:", err);
//     }
//   });
// }

// // Convert captured frames into an MP4 video
// function convertToVideo() {
//   const ffmpegProcess = spawn("ffmpeg", [
//     "-y",
//     "-framerate",
//     1, // Remove the -r option
//     "-i",
//     path.join(outputPath, "output_%d.jpg"),
//     "-c:v",
//     "libx264",
//     "-pix_fmt",
//     "yuv420p",
//     "-t",
//     `${frameCount}`, // Set the duration of the video based on the number of frames captured
//     videoOutputPath,
//   ]);

//   ffmpegProcess.on("exit", () => {
//     console.log("Video conversion completed:", videoOutputPath);

//     // Cleanup: Remove the captured image files
//     for (const framePath of framePaths) {
//       if (fs.existsSync(framePath)) {
//         fs.unlinkSync(framePath);
//       }
//     }

//     // Clear the frame count and paths to start capturing new frames
//     frameCount = 0;
//     framePaths = [];

//     // Start capturing new frames
//     captureFrame();
//   });
// }

//   // Start capturing image frames
//   captureFrame();

//   // Stop capturing frames and convert them into a video every 10 seconds
//   setInterval(() => {
//     Webcam.clear();
//     convertToVideo();
//   }, 10000); // Convert frames to video every 10 seconds (adjust the duration as needed)










  // // // const NodeWebcam = require('node-webcam');
// // // const fs = require('fs');
// // // const path = require('path');
// // // const { spawn } = require('child_process');

// // // const Webcam = NodeWebcam.create({
// // //   device: '/dev/video0',
// // //   width: 1280,
// // //   height: 720,
// // //   quality: 80,
// // //   delay: 0,
// // //   output: 'jpeg',
// // //   verbose: false,
// // // });

// // // const outputPath = '/home/aman/Desktop/workspace/ip_cameras/output'; // Update with the desired output directory
// // // const fps = 30; // Frames per second for the resulting video
// // // const videoOutputPath = '/home/aman/Desktop/workspace/ip_cameras/output/output.mp4'; // Update with the desired video output path

// // // const framesPerVideo = 30; // Number of frames per video
// // // let frameCount = 0;
// // // let videoCount = 0;

// // // // Start capturing and saving image frames
// // // function captureFrame() {
// // //   const filePath = path.join(outputPath, `output_${frameCount}.jpg`); // Use a unique file name for each frame

// // //   Webcam.capture(filePath, (err, data) => {
// // //     if (!err) {
// // //       console.log('Image captured:', data);
// // //       frameCount++;
// // //       console.log('Frame count:', frameCount);

// // //       // Check if the framesPerVideo condition is met
// // //       if (frameCount % framesPerVideo === 0) {
// // //         convertToVideo();
// // //       } else {
// // //         setTimeout(captureFrame, 1000 / fps); // Capture frames at the specified FPS
// // //       }
// // //     } else {
// // //       console.log('Error capturing image:', err);
// // //     }
// // //   });
// // // }

// // // // Convert captured frames into an MP4 video
// // // function convertToVideo() {
// // //   const imageStartIndex = (videoCount * framesPerVideo) + 1; // Start index of images for this video
// // //   const imageEndIndex = frameCount; // End index of images for this video

// // //   const videoOutputFilePath = videoOutputPath; // Use the same video output file path for each conversion

// // //   const ffmpegProcess = spawn('ffmpeg', [
// // //     '-y',
// // //     '-framerate', `${fps}`,
// // //     '-start_number', `${imageStartIndex}`,
// // //     '-i', path.join(outputPath, `output_%d.jpg`),
// // //     '-c:v', 'libx264',
// // //     '-pix_fmt', 'yuv420p',
// // //     '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2,setsar=1',
// // //     '-movflags', 'faststart',
// // //     '-safe', '0',
// // //     '-avoid_negative_ts', 'make_zero',
// // //     '-vf', 'movie=' + videoOutputPath + ' [old]; [in][old] concat',
// // //     '-an',
// // //     videoOutputFilePath
// // //   ]);

// // //   ffmpegProcess.on('exit', (ffmpegCode) => {
// // //     if (ffmpegCode === 0) {
// // //       console.log('Video conversion completed:', videoOutputFilePath);

// // //       // Cleanup: Remove the captured image files
// // //       for (let i = imageStartIndex; i <= imageEndIndex; i++) {
// // //         const filePath = path.join(outputPath, `output_${i}.jpg`);
// // //         if (fs.existsSync(filePath)) {
// // //           fs.unlinkSync(filePath);
// // //         }
// // //       }

// // //       videoCount++;

// // //       // Continue capturing frames
// // //       setTimeout(captureFrame, 1000 / fps);
// // //     } else {
// // //       console.error('Error during video conversion:', ffmpegCode);
// // //     }
// // //   });
// // // }

// // // // Start capturing image frames
// // // captureFrame();

// // const NodeWebcam = require('node-webcam');
// // const fs = require('fs');
// // const path = require('path');
// // const { spawn } = require('child_process');

// // const Webcam = NodeWebcam.create({
// //   device: '/dev/video0',
// //   width: 1280,
// //   height: 720,
// //   quality: 80,
// //   delay: 0,
// //   output: 'jpeg',
// //   verbose: false,
// // });

// // const outputPath = '/home/aman/Desktop/workspace/ip_cameras/output'; // Update with the desired output directory
// // const fps = 30; // Frames per second for the resulting video
// // const videoOutputPath = '/home/aman/Desktop/workspace/ip_cameras/output/final.mp4'; // Update with the desired video output path

// // const framesPerVideo = 30; // Number of frames per video
// // let frameCount = 0;
// // let videoCount = 0;

// // // Start capturing and saving image frames
// // function captureFrame() {
// //   const filePath = path.join(outputPath, `output_${frameCount}.jpg`); // Use a unique file name for each frame

// //   Webcam.capture(filePath, (err, data) => {
// //     if (!err) {
// //       console.log('Image captured:', data);
// //       frameCount++;
// //       console.log('Frame count:', frameCount);

// //       // Check if the framesPerVideo condition is met
// //       if (frameCount % framesPerVideo === 0) {
// //         convertToVideo();
// //       } else {
// //         setTimeout(captureFrame, 1000 / fps); // Capture frames at the specified FPS
// //       }
// //     } else {
// //       console.log('Error capturing image:', err);
// //     }
// //   });
// // }

// // // Convert captured frames into an MP4 video
// // function convertToVideo() {
// //   const imageStartIndex = (videoCount * framesPerVideo) + 1; // Start index of images for this video
// //   const imageEndIndex = frameCount; // End index of images for this video

// //   const videoOutputFilePath = path.join(outputPath, `output_${videoCount}.mp4`); // Output video file path

// //   const ffmpegProcess = spawn('ffmpeg', [
// //     '-y',
// //     '-framerate', `${fps}`,
// //     '-start_number', `${imageStartIndex}`,
// //     '-i', path.join(outputPath, `output_%d.jpg`),
// //     '-c:v', 'libx264',
// //     '-pix_fmt', 'yuv420p',
// //     '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2,setsar=1',
// //     '-movflags', 'faststart',
// //     '-safe', '0',
// //     '-avoid_negative_ts', 'make_zero',
// //     '-f', 'mp4',
// //     '-g', '25',
// //     '-r', '25',
// //     videoOutputFilePath
// //   ]);

// //   ffmpegProcess.on('exit', (ffmpegCode) => {
// //     if (ffmpegCode === 0) {
// //       console.log('Video conversion completed:', videoOutputFilePath);

// //       // Cleanup: Remove the captured image files
// //       for (let i = imageStartIndex; i <= imageEndIndex; i++) {
// //         const filePath = path.join(outputPath, `output_${i}.jpg`);
// //         if (fs.existsSync(filePath)) {
// //           fs.unlinkSync(filePath);
// //         }
// //       }

// //       videoCount++;

// //       // Check if it's the first video or append to the existing final video
// //       if (videoCount === 1) {
// //         fs.copyFileSync(videoOutputFilePath, videoOutputPath);
// //       } else {
// //         const concatProcess = spawn('ffmpeg', [
// //           '-y',
// //           '-f', 'concat',
// //           '-safe', '0',
// //           '-i', path.join(outputPath, 'filelist.txt'),
// //           '-c', 'copy',
// //           '-avoid_negative_ts', 'make_zero',
// //           videoOutputPath
// //         ]);

// //         concatProcess.on('exit', (concatCode) => {
// //           if (concatCode === 0) {
// //             console.log('Video concatenation completed:', videoOutputPath);

// //             // Cleanup: Remove the temporary filelist.txt
// //             const filelistPath = path.join(outputPath, 'filelist.txt');
// //             if (fs.existsSync(filelistPath)) {
// //               fs.unlinkSync(filelistPath);
// //             }
// //           } else {
// //             console.error('Error during video concatenation:', concatCode);
// //           }
// //         });
// //       }

// //       // Continue capturing frames
// //       setTimeout(captureFrame, 1000 / fps);
// //     } else {
// //       console.error('Error during video conversion:', ffmpegCode);
// //     }
// //   });
// // }

// // // Start capturing image frames
// // captureFrame();

// const NodeWebcam = require('node-webcam');
// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');

// const Webcam = NodeWebcam.create({
//   device: 'FaceTime HD Camera',
//   width: 1280,
//   height: 720,
//   quality: 80,
//   delay: 0,
//   output: 'jpeg',
//   verbose: false,
// });

// const outputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output'; // Update with the desired output directory
// const fps = 30; // Frames per second for the resulting video
// const videoOutputPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.mp4'; // Update with the desired video output path

// const framesPerVideo = 30; // Number of frames per video
// let frameCount = 0;
// let videoCount = 0;
// let videoList = []; // List to store the paths of all the converted videos

// // Start capturing and saving image frames
// function captureFrame() {
//   const filePath = path.join(outputPath, `output_${frameCount}.jpg`); // Use a unique file name for each frame

//   Webcam.capture(filePath, (err, data) => {
//     if (!err) {
//       console.log('Image captured:', data);
//       frameCount++;
//       console.log('Frame count:', frameCount);

//       // Check if the framesPerVideo condition is met
//       if (frameCount % framesPerVideo === 0) {
//         convertToVideo();
//       } else {
//         setTimeout(captureFrame, 1000 / fps); // Capture frames at the specified FPS
//       }
//     } else {
//       console.log('Error capturing image:', err);
//     }
//   });
// }

// // Convert captured frames into an MP4 video
// function convertToVideo() {
//   const imageStartIndex = (videoCount * framesPerVideo) + 1; // Start index of images for this video
//   const imageEndIndex = frameCount; // End index of images for this video

//   const videoOutputFilePath = path.join(outputPath, `output_${videoCount}.mp4`); // Output video file path

//   const ffmpegProcess = spawn('ffmpeg', [
//     '-y',
//     '-framerate', `${fps}`,
//     '-start_number', `${imageStartIndex}`,
//     '-i', path.join(outputPath, `output_%d.jpg`),
//     '-c:v', 'libx264',
//     '-pix_fmt', 'yuv420p',
//     '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2,setsar=1',
//     '-movflags', 'faststart',
//     '-safe', '0',
//     '-avoid_negative_ts', 'make_zero',
//     '-f', 'mp4',
//     '-g', '25',
//     '-r', '25',
//     videoOutputFilePath
//   ]);

//   ffmpegProcess.on('exit', (ffmpegCode) => {
//     if (ffmpegCode === 0) {
//       console.log('Video conversion completed:', videoOutputFilePath);

//       // Cleanup: Remove the captured image files
//       for (let i = imageStartIndex; i <= imageEndIndex; i++) {
//         const filePath = path.join(outputPath, `output_${i}.jpg`);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       }

//       videoCount++;
//       videoList.push(videoOutputFilePath);

//       // Check if all videos have been converted
//       if (frameCount === framesPerVideo * videoCount) {
//         combineVideos();
//       } else {
//         // Continue capturing frames
//         setTimeout(captureFrame, 1000 / fps);
//       }
//     } else {
//       console.error('Error during video conversion:', ffmpegCode);
//     }
//   });
// }

// // Combine all converted videos into a single video
// function combineVideos() {
//   const filelistPath = path.join(outputPath, 'filelist.txt'); // Path to store the file list

//   // Create a file list containing paths of all the converted videos
//   const filelistContent = videoList.map((videoPath) => `file '${videoPath}'`).join('\n');
//   fs.writeFileSync(filelistPath, filelistContent);

//   // Concatenate the videos using ffmpeg
//   const concatProcess = spawn('ffmpeg', [
//     '-y',
//     '-f', 'concat',
//     '-safe', '0',
//     '-i', filelistPath,
//     '-c', 'copy',
//     '-avoid_negative_ts', 'make_zero',
//     videoOutputPath
//   ]);

//   concatProcess.on('exit', (concatCode) => {
//     if (concatCode === 0) {
//       console.log('Video concatenation completed:', videoOutputPath);

//       // Cleanup: Remove the temporary filelist.txt
//       if (fs.existsSync(filelistPath)) {
//         fs.unlinkSync(filelistPath);
//       }
//     } else {
//       console.error('Error during video concatenation:', concatCode);
//     }
//   });
// }

// // Start capturing image frames
// captureFrame();

