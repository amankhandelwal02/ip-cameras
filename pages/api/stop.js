// const { spawn } = require("child_process");

// export default function handler(req, res) {
//     if (req.method === "GET") {
//         function killProcessOnPort(port) {
//             const killCommand = process.platform === "win32" ? "taskkill" : "kill";
//             const command = process.platform === "win32" ? `netstat -ano | findstr :${port}` : `lsof -i:${port}`;

//             const getProcessId = spawn(command, { shell: true });

//             let processId = "";

//             getProcessId.stdout.on("data", (data) => {
//               processId += data.toString();
//             });

//             getProcessId.on("close", () => {
//               const regex = process.platform === "win32" ? /[\d]+$/ : /\s+([\d]+)\s/;
//               const matches = processId.match(regex);

//               if (matches && matches[1]) {
//                 const pid = matches[1];
//                 console.log(`Process running on port ${port} has PID: ${pid}`);
//                 killProcess(pid);
//               } else {
//                 console.log(`No process found running on port ${port}`);
//                 res.status(200).json({ message: `No process found running on port ${port}` });  
//               }
//             });
//           }

//           function killProcess(pid) {
//             const killCommand = process.platform === "win32" ? "taskkill" : "kill";
//             const killProcess = spawn(killCommand, [process.platform === "win32" ? "/F" : "-9", pid]);

//             killProcess.stdout.on("data", (data) => {
//               console.log(`stdout: ${data}`);
//             });

//             killProcess.stderr.on("data", (data) => {
//               console.error(`stderr: ${data}`);
//             });

//             killProcess.on("close", (code) => {
//               console.log(`Child process exited with code ${code}`);
//               res.status(200).json({ message: `Child process exited with code ${code}` });
//             });
//           }

//           // Example: Kill process running on port 3001
//           killProcessOnPort(3001);      
//     }
// }

// pages/api/stop.js

import fs from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';

const outputPath = "/home/aman/Desktop/workspace/ip_cameras/output";
const hlsOutputPath = "/home/aman/Desktop/workspace/ip_cameras/hls";
let captureInterval;

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Stop FFmpeg process
    const stopFFmpegProcess = () => {
      const ffmpegProcess = spawn('pkill', ['ffmpeg']);
      ffmpegProcess.on('close', () => {
        console.log('FFmpeg process stopped');
      });
    };

    // Clear directories
    const clearDirectories = () => {
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
        console.log('Output directory cleared');
      }

      if (fs.existsSync(hlsOutputPath)) {
        fs.rmSync(hlsOutputPath, { recursive: true, force: true });
        console.log('HLS output directory cleared');
      }
    };

    // Stop capture interval
    clearInterval(captureInterval);

    stopFFmpegProcess();
    clearDirectories();

    res.status(200).json({ message: 'Processes stopped and cleanup completed.' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

