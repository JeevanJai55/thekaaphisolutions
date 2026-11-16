const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, 'dist');
const port = Number(process.argv.find(arg => arg.startsWith('--port='))?.split('=')[1] || 4174);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2'
};

const staticAssetExtensions = new Set(['.css', '.js', '.mjs', '.svg', '.webp', '.jpeg', '.jpg', '.png', '.pdf', '.woff2', '.mp4', '.xml', '.txt']);

function resolveCacheControl(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.html') return 'public, max-age=300, must-revalidate';
  if (staticAssetExtensions.has(extension)) return 'public, max-age=31536000, immutable';
  return 'no-store';
}

function sendSecurityHeaders(res) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=()'
  };

  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
}

const server = http.createServer((req, res) => {
  sendSecurityHeaders(res);

  let file;
  try {
    file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  if (file === root || file.endsWith(path.sep)) file = path.join(file, 'index.html');

  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) {
      fs.readFile(path.join(root, '404.html'), (notFoundError, page) => {
        if (notFoundError) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
          return;
        }

        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        if (req.method === 'HEAD') res.end(); else res.end(page);
      });
      return;
    }

    const ext = path.extname(file).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    const headers = {
      'Content-Type': type,
      'Cache-Control': resolveCacheControl(file),
      'Accept-Ranges': 'bytes'
    };

    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;

      if (start > end || start >= stat.size) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size });
        res.end();
        return;
      }

      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, { ...headers, 'Content-Length': stat.size });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  });
});

server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`));
process.on('SIGINT', () => server.close(() => process.exit(0)));
