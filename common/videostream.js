import { createReadStream, statSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';

export default function streamHandler(req, res) {
  if (req.method === 'GET') {
    const videoPath = join(process.cwd(), 'output', 'earth.mp4'); // Adjust the path as per your project structure
    const videoStat = statSync(videoPath);

    const { size } = videoStat;
    const range = req.headers.range;
    const CHUNK_SIZE = 10 ** 6; // 1MB

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunkSize = end - start + 1;

      const file = createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(200, head);
      createReadStream(videoPath).pipe(res);
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
