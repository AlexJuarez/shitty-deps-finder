'use strict';

const FileList = require('./file-list');
const Watcher = require('./watcher');
const EventEmitter = require('events');

class Tracker extends EventEmitter {
  constructor(config) {
    super();
    const self = this;
    const conf = this._config = config || {};
    this._files = [];
    this._fileList = new FileList(conf);

    if (conf.watch) {
      this._watcher = new Watcher(conf, this._fileList);
      this.on('exit', () => {
        self._watcher.emit('exit');
      });
    }

    this._fileList.on('file_list_modified', (files) => {
      self.diff(files);
    });
  }

  dumpStore() {
    return this._fileList.getStore().toJSON();
  }

  hydrate(json) {
    this._fileList.getStore().hydrate(json);
    this._files = this._fileList.files().slice(0);
  }

  diff(files) {
    const self = this;
    const changed = [];

    files.forEach((file) => {
      let index = self._files.indexOf(file);
      if (index > -1) {
        if (self._files[index].mtime < file.mtime) {
          changed.push(file);
        }
      } else {
        changed.push(file);
      }
    });

    this._files = files.slice(0);
    this.emit('changed', changed);
  }

  refresh() {
    return this._fileList.refresh();
  }
}

module.exports = Tracker;
