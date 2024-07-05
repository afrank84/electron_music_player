const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle metadata request from renderer
ipcMain.handle('parse-metadata', async (event, fileBuffer) => {
  const { parseBuffer } = await import('music-metadata');
  const metadata = await parseBuffer(Buffer.from(fileBuffer));
  return metadata;
});
