const fs = require('fs');

export default async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
  
    const filePath = '/home/aman/Desktop/workspace/ip_cameras/hls/stream.m3u8'; // Update with the correct file path
  
    const watcher = fs.watch(filePath, (event) => {
      if (event === 'change') {
        const streamData = fs.readFileSync(filePath, 'utf8');
        res.write(`data: ${streamData}\n\n`);
      }
    });
  
    req.on('close', () => {
      watcher.close();
      res.end();
    });
  };
  