const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  // Main window API
  updateTray: (state) => ipcRenderer.send("update-tray", state),
  getApiUrl: () => ipcRenderer.invoke("get-api-url"),
  getPlatform: () => ipcRenderer.invoke("get-platform"),
  isDev: () => ipcRenderer.invoke("is-dev"),
  onNavigate: (callback) => ipcRenderer.on("navigate", (_event, path) => callback(path)),
  onCompose: (callback) => ipcRenderer.on("compose", () => callback()),
  onFocusSearch: (callback) => ipcRenderer.on("focus-search", () => callback()),
  onSelectAlias: (callback) => ipcRenderer.on("select-alias", (_event, handle) => callback(handle)),
  onRefreshInbox: (callback) => ipcRenderer.on("refresh-inbox", () => callback()),

  // Tray panel API (called from tray.html)
  selectAliasFromTray: (handle) => ipcRenderer.send("tray-select-alias", handle),
  composeFromTray: () => ipcRenderer.send("tray-compose"),
  focusSearchFromTray: () => ipcRenderer.send("tray-search"),
  openInboxFromTray: () => ipcRenderer.send("tray-open-inbox"),
  refreshFromTray: () => ipcRenderer.send("tray-refresh"),
  quitFromTray: () => ipcRenderer.send("tray-quit"),

  // Tray panel receives state
  onTrayState: (callback) => ipcRenderer.on("tray-state", (_event, state) => callback(state)),

  // Force sign-in navigation from renderer
  forceSignIn: () => ipcRenderer.send("force-sign-in"),
})
