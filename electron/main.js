const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell, nativeTheme, protocol, net } = require("electron")
const path = require("path")
const fs = require("fs")

const isDev = !app.isPackaged
const API_URL = process.env.API_URL || "https://api.aeri.rest"
const NEXT_PORT = 3000

if (!isDev) {
  protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
  ])
}

let mainWindow = null
let tray = null
let isQuitting = false
let trayState = { totalUnread: 0, recentMessages: [], aliases: [], accountEmail: "", plan: "" }

const TRAY_ICON_SIZE = 22

function createTrayIcon(badge) {
  const size = TRAY_ICON_SIZE
  const badgeSvg = badge > 0
    ? `<circle cx="${size - 3}" cy="3" r="4.5" fill="#22C55E"/>
       <text x="${size - 3}" y="5.2" text-anchor="middle" fill="#000"
             font-size="7" font-weight="700" font-family="system-ui">${badge > 9 ? "9+" : badge}</text>`
    : ""
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="${size - 6}" height="${size - 9}" rx="1.5" ry="1.5"
            fill="none" stroke="${badge > 0 ? "#22C55E" : "black"}" stroke-width="1.6"/>
      <polyline points="3,5.5 ${size / 2},${size / 2 - 0.5} ${size - 3},5.5"
                fill="none" stroke="${badge > 0 ? "#22C55E" : "black"}" stroke-width="1.3" stroke-linejoin="round"/>
      ${badgeSvg}
    </svg>
  `
  return nativeImage.createFromBuffer(Buffer.from(svg))
}

function buildTrayMenu() {
  const { totalUnread, recentMessages, aliases, accountEmail, plan } = trayState
  const sections = []

  if (accountEmail) {
    sections.push({
      label: accountEmail,
      enabled: false,
    })
    if (plan && plan !== "free") {
      sections.push({
        label: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`,
        enabled: false,
      })
    }
    sections.push({ type: "separator" })
  }

  sections.push({
    label: totalUnread > 0 ? `  ${totalUnread} unread message${totalUnread === 1 ? "" : "s"}` : "  No unread messages",
    enabled: false,
  })
  sections.push({ type: "separator" })

  if (recentMessages.length > 0) {
    const recentSubmenu = recentMessages.slice(0, 6).map((msg) => ({
      label: `${msg.from}  —  ${msg.subject.length > 32 ? msg.subject.slice(0, 32) + "…" : msg.subject}`,
      enabled: false,
    }))
    if (recentMessages.length > 6) {
      recentSubmenu.push({ label: `…and ${recentMessages.length - 6} more`, enabled: false })
    }
    sections.push({
      label: "Recent",
      submenu: recentSubmenu,
    })
    sections.push({ type: "separator" })
  }

  if (aliases.length > 0) {
    const aliasSubmenu = aliases.map((alias) => ({
      label: `${alias.handle}${alias.unread > 0 ? `  (${alias.unread})` : ""}`,
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
          mainWindow.webContents.send("select-alias", alias.handle)
        }
      },
    }))
    sections.push({
      label: "Aliases",
      submenu: aliasSubmenu,
    })
    sections.push({ type: "separator" })
  }

  sections.push({
    label: "Compose",
    accelerator: "CmdOrCtrl+N",
    click: () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send("compose")
      }
    },
  })

  sections.push({
    label: "Search",
    accelerator: "CmdOrCtrl+K",
    click: () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send("focus-search")
      }
    },
  })

  sections.push({ type: "separator" })

  sections.push({
    label: "Inbox",
    accelerator: "CmdOrCtrl+Shift+I",
    click: () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send("navigate", "/inbox")
      }
    },
  })

  sections.push({
    label: "Settings",
    accelerator: "CmdOrCtrl+,",
    click: () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send("navigate", "/settings")
      }
    },
  })

  sections.push({ type: "separator" })

  sections.push({
    label: "Quit aeri",
    accelerator: "CmdOrCtrl+Q",
    click: () => {
      isQuitting = true
      app.quit()
    },
  })

  return Menu.buildFromTemplate(sections)
}

function updateTray(state) {
  if (!tray) return
  trayState = { ...trayState, ...state }
  const icon = createTrayIcon(trayState.totalUnread)
  tray.setImage(icon)
  tray.setTitle(trayState.totalUnread > 0 ? `${trayState.totalUnread}` : "")
  tray.setToolTip(
    trayState.totalUnread > 0
      ? `aeri — ${trayState.totalUnread} unread`
      : "aeri — No unread messages"
  )
  tray.setContextMenu(buildTrayMenu())
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 720,
    minWidth: 680,
    minHeight: 480,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 14, y: 14 },
    vibrancy: "under-window",
    visualEffectState: "active",
    backgroundColor: "#09090b",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: isDev,
      sandbox: false,
    },
  })

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${NEXT_PORT}`)
    mainWindow.webContents.openDevTools({ mode: "detach" })
  } else {
    mainWindow.loadURL("app://localhost/index.html")
  }

  mainWindow.once("ready-to-show", () => mainWindow.show())

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on("closed", () => { mainWindow = null })

  mainWindow.webContents.setWindowOpenHandler(({ url: linkUrl }) => {
    shell.openExternal(linkUrl)
    return { action: "deny" }
  })

  if (!isDev) {
    mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
      console.error(`[aeri] Failed to load: ${validatedURL} — ${errorCode} ${errorDescription}`)
    })

    mainWindow.webContents.on("render-process-gone", (_event, details) => {
      console.error(`[aeri] Renderer crashed: ${details.reason}`, details)
    })

    mainWindow.webContents.on("unresponsive", () => {
      console.warn("[aeri] Renderer became unresponsive")
    })

    mainWindow.webContents.on("console-message", (_event, level, message) => {
      if (level >= 2) {
        console.error(`[aeri:renderer] ${message}`)
      }
    })
  }
}

function setupMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: "aeri",
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteAndMatchStyle" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" },
        { type: "separator" },
        { role: "window" },
      ],
    },
  ]))
}

app.whenReady().then(() => {
  if (!isDev) {
    const outDir = path.join(__dirname, "..", "out")
    protocol.handle("app", (request) => {
      const pathname = decodeURIComponent(new URL(request.url).pathname)
      let filePath = path.join(outDir, pathname)

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html")
      }

      if (!fs.existsSync(filePath)) {
        filePath = path.join(outDir, "index.html")
      }

      return net.fetch(`file://${filePath}`)
    })
  }

  setupMenu()
  createMainWindow()
  const icon = createTrayIcon(0)
  tray = new Tray(icon)
  tray.setTitle("")
  tray.setToolTip("aeri — No unread messages")
  tray.setContextMenu(buildTrayMenu())

  tray.on("click", () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.focus() : mainWindow.show()
    }
  })

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    else if (mainWindow) mainWindow.show()
  })
})

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit() })
app.on("before-quit", () => { isQuitting = true })

ipcMain.on("update-tray", (_event, state) => updateTray(state))
ipcMain.handle("get-api-url", () => API_URL)
ipcMain.handle("get-platform", () => process.platform)
ipcMain.handle("is-dev", () => isDev)
