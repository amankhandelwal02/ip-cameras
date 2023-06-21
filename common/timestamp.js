import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const videoPath = '/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.mp4'; // Update with the path to your video file

const getVideoTimestamp = () => {
  const videoStat = fs.statSync(videoPath);
  const lastModified = videoStat.mtime.toUTCString();
  return lastModified;
};

export default function handler(req, res) {
  try {
    const lastModified = getVideoTimestamp();
    res.status(200).send(lastModified);
  } catch (error) {
    console.error('Error getting video timestamp:', error);
    res.status(500).send('Error getting video timestamp');
  }
}
