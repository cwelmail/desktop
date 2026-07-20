const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  updateTray: (state) => ipcRenderer.send("update-tray", state),
  getApiUrl: () => ipcRenderer.invoke("get-api-url"),
  getPlatform: () => ipcRenderer.invoke("get-platform"),
  isDev: () => ipcRenderer.invoke("is-dev"),
  onNavigate: (callback) => ipcRenderer.on("navigate", (_event, path) => callback(path)),
  onCompose: (callback) => ipcRenderer.on("compose", () => callback()),
  onFocusSearch: (callback) => ipcRenderer.on("focus-search", () => callback()),
  onSelectAlias: (callback) => ipcRenderer.on("select-alias", (_event, handle) => callback(handle)),
})
