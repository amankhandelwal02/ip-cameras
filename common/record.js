const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Convert captured frames into an MP4 video
const outputPath = "/Users/ezeejain/Desktop/Lens_View/IP_NEW/ip-cameras/output"; // Update with the desired output directory
const videoOutputPath =
  "/Users/ezeejain/Desktop/Lens_View/IP_NEW/ip-cameras/public/recordings/output.mp4"; // Update with the desired video output path

  let frameCount = 0;
  let framePaths = [];
  let intervalId = null; // Variable to store the interval ID

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
  });
}


export default function handler(req, res) {
    if (req.method === 'GET') {
      // Clear any previous interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Set a new interval to convert video every 5000 milliseconds (5 seconds)
    intervalId = setInterval(convertToVideo, 5000);

    res.status(200).json({
      message: "Recording started!!",
    });
    }
}