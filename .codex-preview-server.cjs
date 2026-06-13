const fs = require("fs");
const http = require("http");
const path = require("path");

const root = process.cwd();
const port = Number(process.env.PORT || 8777);
const host = "127.0.0.1";
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

http
  .createServer((request, response) => {
    const url = new URL(request.url, `http://${host}:${port}`);
    const relative = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    let target = path.resolve(root, decodeURIComponent(relative));

    if (!target.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.stat(target, (statError, stats) => {
      if (!statError && stats.isDirectory()) {
        target = path.join(target, "index.html");
      }

      fs.readFile(target, (error, body) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(target)] || "text/plain; charset=utf-8"
      });
      response.end(body);
      });
    });
  })
  .listen(port, host, () => {
    console.log(`Serving ${root} at http://${host}:${port}/`);
  });
