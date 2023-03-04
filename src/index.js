import http from 'http'
// import formidable from 'formidable';
import busboy from 'busboy';
import fs from 'fs';
import path from 'path';


const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <form action="/upload" enctype="multipart/form-data" method="post">
          <input type="file" name="someCoolFiles" accept="image/png"><br>
          <button>Upload</button>
        </form>
      `);
    } else if (req.url === '/upload') {
      let filename = 'QRCode.png';
      const bb = busboy({ headers: req.headers });
      bb.on('file', (name, file, info) => {
        // filename = info.filename;
        const saveTo = path.join("./img/", filename);
        file.pipe(fs.createWriteStream(saveTo));
      });
      bb.on('close', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`upload success: ${filename}`);
      });
      req.pipe(bb);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404');
    }
  });
  
  server.listen(8080, () => {
    console.log('Server listening on http://localhost:8080 ...');
  });