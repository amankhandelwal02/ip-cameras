import stopCaptureInterval from "./stopCaptureInterval";
import transcodeToHLS from "./transcodeToHls";
const path = require("path");
const { spawn } = require("child_process");
const NodeWebcam = require("node-webcam");
const fs = require("fs");

    // Convert captured frames into an MP4 video
    const outputPath =
      "/Users/ezeejain/Desktop/Lens_View/IP_NEW/ip-cameras/output"; // Update with the desired output directory
    const videoOutputPath =
      "/Users/ezeejain/Desktop/Lens_View/IP_NEW/ip-cameras/public/recordings/output.mp4"; // Update with the desired video output path

export default function convertToVideo(frameCount, framePaths) {
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
    });
  }