const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PORT = 47821;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Defeat DNS rebinding: only accept requests addressed to this loopback server.
      const host = (req.headers.host || '').split(',')[0].trim();
      if (host !== `127.0.0.1:${PORT}` && host !== `localhost:${PORT}`) {
        res.writeHead(403);
        res.end();
        return;
      }

      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const requested = path.normalize(path.join(DIST_DIR, urlPath));

      // Keep the resolved path contained inside DIST_DIR; anything else (e.g. "..") falls
      // back to the SPA shell rather than reading files outside the built app.
      let filePath = requested === DIST_DIR || requested.startsWith(DIST_DIR + path.sep)
        ? requested
        : path.join(DIST_DIR, 'index.html');

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
      });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function createWindow() {
  await startServer();

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    icon: path.join(__dirname, '..', 'build-resources', 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(`http://127.0.0.1:${PORT}/`);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
