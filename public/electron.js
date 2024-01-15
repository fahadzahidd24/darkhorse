const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        fullscreen: false,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // mainWindow.loadURL(url.format({
    //     pathname:  path.join(__dirname, 'index.html'),
    //     protocol: 'file:',
    //     slashes: true,
    // }));
    mainWindow.setTitle('StagePro');
    mainWindow.setIcon(path.join(__dirname, 'logoMain.png'));

    mainWindow.loadURL('https://darkhorse-nine.vercel.app');

    // Open the DevTools (remove this line in production)
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Show the window when it is ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}
// function createWindow() {
//     mainWindow = new BrowserWindow({
//         width: 1920,
//         height: 1080,
//         fullscreen: false,
//         autoHideMenuBar: true,
//         show: false,
//         webPreferences: {
//             nodeIntegration: true,
//         },
//     });

//     // Use loadFile with a relative path to the HTML file
//     mainWindow.loadURL('https://darkhorse-nine.vercel.app');

//     mainWindow.setTitle('StagePro');
//     mainWindow.setIcon(path.join(__dirname, 'logoMain.png'));

//     // Open the DevTools (remove this line in production)
//     // mainWindow.webContents.openDevTools();

//     mainWindow.on('closed', function () {
//         mainWindow = null;
//     });

//     // Show the window when it is ready
//     mainWindow.once('ready-to-show', () => {
//         mainWindow.show();
//     });
// }



app.on('ready', createWindow);


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
