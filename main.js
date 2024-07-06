const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Preload script
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
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

// Handle folder selection request from renderer
ipcMain.handle('select-folder', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });

    if (result.canceled) {
        return [];
    } else {
        const folderPath = result.filePaths[0];
        const files = fs.readdirSync(folderPath).filter(file => {
            return ['.mp3', '.wav', '.ogg'].includes(path.extname(file).toLowerCase());
        }).map(file => path.join(folderPath, file));
        return files;
    }
});

ipcMain.handle('showOpenDialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
  });
  if (result.canceled) {
      return { filePath: null };
  } else {
      return { filePath: result.filePaths[0] };
  }
});
