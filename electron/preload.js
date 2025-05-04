
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  // we can expose ipc later
})
