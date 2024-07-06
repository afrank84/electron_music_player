const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  parseMetadata: async (fileBuffer) => ipcRenderer.invoke('parse-metadata', fileBuffer),
  selectFolder: async () => ipcRenderer.invoke('select-folder'),
  showOpenDialog: async () => ipcRenderer.invoke('showOpenDialog')
});
