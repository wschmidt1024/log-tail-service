const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadFile('electron.html');

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'electron.html'),
		protocol: 'file:',
		slashes: true
	}));

	win.webContents.openDevTools();

	win.on('closed', () => {
		win = null;
	});
}

ipcMain.on('openFolder', (event, path, choice) => {
	const { dialog } = require('electron');
	choice = choice || 'openFile';
	dialog.showOpenDialog(
		win,
		{
			properties: [choice]
		},
		paths => respondWithPath(paths)
	);
	function respondWithPath(paths) {
		event.sender.send('folderData', paths);
	}
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});

exports.selectDirectory = function () {
	dialog.showOpenDialog(mainWindow, {
		properties: ['openDirectory']
	});
}
