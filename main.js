const {app, BrowserWindow, ipcMain} = require('electron')
    const url = require("url");
    const path = require("path");

    const fs = require('fs');

    let mainWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
      })

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      // Open the DevTools.
      mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }

    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })

    ipcMain.on('read', () => {
        fs.readFile('./src/assets/store.json', (err, data) => {
            if (err) throw err;
            let store = JSON.parse(data);
            mainWindow.webContents.send('store_chanel', store);
            console.log(store);
        });
    })

    // read customer list
    ipcMain.on('read_customer_list', () => {
      fs.readFile('./src/assets/customer.json', (err, data) => {
          if (err) throw err;
          let store = JSON.parse(data);
          mainWindow.webContents.send('customer_chanel', store);
          console.log(store);
      });
  })

    // write customer list
    ipcMain.on('write_customer_list', (event, data) => {
      fs.writeFile('./src/assets/customer.json', JSON.stringify(data), (err) => {
          if (err) throw err;
          let store = JSON.parse(data);
          mainWindow.webContents.send('error', err);
      });
      console.log('Saved!');
  })


ipcMain.on('write_store_channel', (event, data) => {
  console.log('write_data', JSON.stringify(data));
  fs.writeFile('./src/assets/store.json', JSON.stringify(data), (err) => {
    if (err) {
      mainWindow.webContents.send('error', err);
    }
    console.log('Saved!');
  });
})