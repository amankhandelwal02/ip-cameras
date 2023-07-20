
const path = require("path");
const { spawn } = require("child_process");

export default function transcodeToHLS(outputPath, frameCount, hlsOutputPath, isTranscoding, framePaths) {
    const inputPattern = path.join(outputPath, "output_%d.jpg");
    const frameRate = 3;
    const frameDuration = 1;
    const numFrames = Math.floor(frameRate * frameDuration);
    const startNumber =
      frameCount - numFrames >= 0 ? frameCount - numFrames * 1 : 0;

    const commonArgs = [
      "-y",
      "-start_number",
      startNumber,
      "-framerate",
      frameRate.toString(),
      "-i",
      inputPattern,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-b:v",
      "2000k",
      "-f",
      "hls",
      "-hls_time",
      "0",
      "-hls_list_size",
      "0",
      "-hls_segment_filename",
      path.join(hlsOutputPath, "output_%d.ts"),
      "-hls_flags",
      "append_list+omit_endlist",
      path.join(hlsOutputPath, "stream.m3u8"),
    ];

    const ffmpegArgs = commonArgs.concat([]);

    const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

    ffmpegProcess.on("exit", () => {
      console.log("HLS conversion completed");
      isTranscoding = false;
      framePaths = [];
    });
  }