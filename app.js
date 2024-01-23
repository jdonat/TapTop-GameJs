const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width : 800,
        height : 800,
        webPreferences : {
            nodeIntegration : true
        }
    })
    app.whenReady().then(createWindow)
    win.loadFile('./index.html')
}


