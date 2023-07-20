import stopCaptureInterval from "./stopCaptureInterval";
import transcodeToHLS from "./transcodeToHls";
const path = require("path");
const NodeWebcam = require("node-webcam");
const fs = require("fs");

const Webcam = NodeWebcam.create({
  device: "FaceTime HD Camera",
  width: 1280,
  height: 720,
  quality: 80,
  delay: 0,
  output: "jpeg",
  verbose: false,
});


export default function captureFrame(frameCount, framePaths, isTranscoding) {
  const outputPath = "/Users/ezeejain/Desktop/Lens_View/IP_NEW/ip-cameras/output";
  const filePath = path.join(outputPath, `output_${frameCount}.jpg`);

  Webcam.capture(filePath, (err, data) => {
    if (!fs.existsSync(outputPath)) {
      console.log("no such directory");
      stopCaptureInterval(); // Stop the interval when an error occurs
    }

    if (!err) {
      console.log("Image captured:", data);
      framePaths.push(filePath);
      frameCount++;
      console.log("Frame count:", frameCount);

      if (!isTranscoding) {
        isTranscoding = true;
        
        transcodeToHLS();
      }
    } else {
      console.log("Error capturing image:", err);
      stopCaptureInterval(); // Stop the interval when an error occurs
    }
  });
}
