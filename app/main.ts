// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const url = require("url");
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let spotifyLoginWindow
let youtubeLoginWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  const startUrl = url.format({
    pathname: path.join(__dirname, "../index.html"),
    protocol: "file:",
    slashes: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(startUrl);

  mainWindow.maximize();

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.webContents.on("will-navigate", function(event, newUrl) {
    console.log(newUrl);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function createYoutubeLoginWindow(authUrl) {
  youtubeLoginWindow = new BrowserWindow({
    window: 400,
    height: 600,
    title: "Login to Youtube"
  });

  youtubeLoginWindow.loadURL(authUrl);

  youtubeLoginWindow.on("close", () => {
    youtubeLoginWindow = null;
  });
}

function createSpotifyLoginWindow(authUrl) {
  spotifyLoginWindow = new BrowserWindow({
    window: 400,
    height: 600,
    title: "Login to Spotify"
  });

  spotifyLoginWindow.loadURL(authUrl);

  spotifyLoginWindow.webContents.on("will-navigate", function(event, newUrl) {
    console.log(newUrl);
  });

  /*Spotify uses hash fragments to send tokens, one way to get these is to send an event in main.ts when a redirect happens matching our redirect_uri,
  then parse it (happens in spotifyauth.ts) to retain the hash fragment.
  See https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow .*/
  spotifyLoginWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl: string) => {
    if (newUrl.indexOf("localhost:8888/spotifycallback") > -1) {
      mainWindow.webContents.send("spotify:loggedin", newUrl);
    }
  })

  spotifyLoginWindow.on("close", () => {
    spotifyLoginWindow = null;
  });
}

ipcMain.on("youtube:login", (event, authUrl) => {
  createYoutubeLoginWindow(authUrl);
});

ipcMain.on("youtube:loggedin", () => {
  youtubeLoginWindow.close();
});

ipcMain.on("spotify:login", (event, authUrl) => {
  createSpotifyLoginWindow(authUrl);
});

ipcMain.on("spotify:loggedin", () => {
  spotifyLoginWindow.close();
});