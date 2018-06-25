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

    const map = {};
    for( let i = 0; i < self._files.length; i++ ) {
      const file = self._files[i];
      map[file.path] = file;
    }

    files.forEach((file) => {
      const prev = map[file.path];
      if (prev != null && prev.mtime >= file.mtime) {
        return;
      }

      changed.push(file);
    });

    this._files = files.slice(0);
    this.emit('changed', changed);
  }

  refresh() {
    return this._fileList.refresh();
  }
}

module.exports = Tracker;
