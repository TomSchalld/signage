const { app, BrowserWindow, remote } = require('electron')
const log = require('electron-log')
const { readdirSync, existsSync, mkdirSync, unlinkSync } = require('fs')
const { join } = require('path');
let env;
try {
  env = require('./env.prod').env
} catch (error) {
  env = require('./env').env
}
const { Client } = require('electron-ssh2')


let filenames = [];
let dataPath;
let mainWindow;

module.exports = {
  setMainWindow: function (window) {
    mainWindow = window;
  },
  loadExistingPictures: function () {
    log.debug('Attempting load of local images');
    const root = readdirSync(dataPath);
    if(root.length>0)
    root.forEach(el => {
      log.debug(el);
      if(el.startsWith('.')){
        return;
      }
      filenames.push(el);
      log.debug('Making IPC call to send ' + el);
      mainWindow.webContents.send('image:add', el);
    });
    log.debug('finished reading local dir');
  },
  findDifference: function (leftSet, rightSet) {
    rightSet = new Set([...rightSet]);
    return new Set([...leftSet].filter(x => !rightSet.has(x)));
  },
  deletePicture: function (filename) {
    log.debug('Attempting deletion of local image: ' + filename);
    // 1. delete from view
    mainWindow.webContents.send('image:remove', filename);
    // 2. delete from fs
    try {
      unlinkSync(join(dataPath, filename));
    } catch (error) {
      log.error(error);
      return;
    }
    // 3. delete from filename[]
    const index = filenames.indexOf(filename);
    if (index > -1) {
      filenames.splice(index, 1);
    }
  },

  downloadImages: function () {

    const conn = new Client();
    conn.on('ready', function () {
      log.debug('SSH Client Connected');
      conn.sftp((err, sftp) => {
        if (err) {
          log.debug(err);
          throw err;
        }
        sftp.readdir(env.REMOTE_FOLDER, (err, list) => {
          if (err) {
            log.debug(err);
            throw err;
          }

          let filenamesOnServer = new Set(list.map(el => el.filename));
          if (new Set(filenames).isEqual(filenamesOnServer)) {
            log.debug('Nothing to do, closing connection');
            conn.end();
            return;
          }
          let toBeDeleted = module.exports.findDifference(filenames, filenamesOnServer);
          let toBeDownloaded = module.exports.findDifference(filenamesOnServer, filenames);
          toBeDeleted.forEach(filename => module.exports.deletePicture(filename));

          toBeDownloaded.forEach(file => {
            if (!file) {
              log.debug('Strange things are going on');
              return;
            }
            log.debug('Trying to download ' + env.REMOTE_FOLDER + file + ' to dir: ' + join(dataPath, file));
            sftp.fastGet(env.REMOTE_FOLDER + file, join(dataPath, file), function (err) {
              if (err) {
                log.debug('Error on downloading: ' + file);
                log.debug(err);
              } else {
                log.debug('Finsihed download ' + env.REMOTE_FOLDER + file + ' to dir: ' + join(dataPath, file));
                mainWindow.webContents.send('image:add', file);
                filenames.push(file);
                if (new Set(filenames).isEqual(filenamesOnServer)) {
                  log.debug('Nothing to do, closing connection');
                  conn.end();
                }
              }
            });
          });
        });
      });

    }).connect({
      username: env.SFTP_USER,
      password: env.SFTP_PASSWORD,
      host: env.SFTP_PROVIDER,
      port: env.PORT,
    });

  },

  createLocalDir: function () {
    log.debug('Local folder: ' + dataPath);
    if (!existsSync(dataPath)) {
      log.debug('Creating folder ' + dataPath);
      mkdirSync(dataPath);
    }
  },

  setPath: function () {
    log.debug('Trying to set Data Path');
    dataPath = join(app.getPath('userData'), env.LOCAL_FOLDER);
    log.debug('Data Path set to: ' + dataPath);
  },

  giveLifeSign: function () {
    log.debug('App is alive');
  }
}
Set.prototype.isEqual = function (otherSet) {
  if (this.size !== otherSet.size) return false;
  for (let item of this) if (!otherSet.has(item)) return false;
  return true;
}
