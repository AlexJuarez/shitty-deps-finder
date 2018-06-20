'use strict';

const EventEmitter = require('events');
const Promise = require('bluebird');
const mm = require('minimatch');
const FileStore = require('./store/file');
const File = require('./file');
const constants = require('./constants');
const fg = require('fast-glob');
const log = require('./logger');
const fs = Promise.promisifyAll(require('graceful-fs'));
const compact = require('lodash.compact');
const throttle = require('lodash.throttle');
const pathLib = require('path');

const isEmpty = (arr) => !Array.isArray(arr) || !arr.length;

class FileList extends EventEmitter {
  constructor(config) {
    super();
    config = config || {};

    this._cwd = config.cwd || process.cwd();
    this._patterns = config.files;
    this._excludes = config.exclude;
    this._preprocess = config.preprocess;
    this._refreshing = Promise.resolve();
    this._refreshInterval = config.refreshInterval;
    this._files = new FileStore(config);
  }

  getStore() {
    return this._files;
  }

  files() {
    return this._files.files();
  }

  refresh() {
    if (this._isRefreshing()) {
      this._refreshing.cancel();
    }

    this._refreshing = this._refresh();
    return this._refreshing;
  }

  addFile(path) {
    const self = this;

    if (this._isExcluded(path)) {
      log.debug(`Add file ${path} excluded.`);

      return Promise.resolve(this.files);
    }

    if (this._isIncluded(path)) {
      log.debug(`Add file ${path} does not match any patterns.`);

      return Promise.resolve(this.files);
    }

    const file = new File(path);
    this._files.addFile(file);

    return Promise.all([
      fs.statAsync(path),
      this._refreshing
    ]).spread((stat) => {
      file.mtime = stat.mtime;
      return self._preprocess(file);
    })
    .then(() => {
      log.info(`Added file ${path}.`);
      self._emitModified(true);
      return self.files();
    });
  }

  changeFile(path) {
    const self = this;

    const file = this._files.findFile(path);
    if (!file) {
      log.debug(`Changed file ${path} ignored. Does not match any file in the list.`);
      return Promise.resolve(this.files());
    }

    return Promise.all([
      fs.statAsync(path),
      this._refreshing
    ]).spread((stat) => {
      if (stat.mtime <= file.mtime) {
        throw new Promise.CancellationError();
      }

      file.mtime = stat.mtime;
      return self._preprocess(file);
    })
    .then(() => {
      log.info(`Changed file ${path}`);
      self._emitModified();
      return self.files();
    })
    .catch(Promise.CancellationError, () => {
      return self.files();
    });
  }

  removeFile(path) {
    const self = this;

    return Promise.try(() => {
      const file = self._files.findFile(path);

      if (!file) {
        log.debug(`Remove file ${path} ignored. File is not in the file list.`);
        return self.files();
      }

      self._files.removeFile(file);
      log.info(`Removed file ${path}`);
      self._emitModified();
      return self.files();
    });
  }

  _emitModified(immediate) {
    const self = this;
    function emit(){
      self.emit('file_list_modified', self.files());
    }

   if (immediate) {
     emit();
   } else {
     throttle(emit, this._refreshInterval, {leading: false})();
   }
  }

  _isIncluded(path) {
    return this._patterns.some((pattern) => {
      return mm(path, pattern);
    })
  }

  _isExcluded(path) {
    return this._excludes.some((pattern) => {
      return mm(path, pattern);
    });
  }

  _isRefreshing() {
    return this._refreshing.isPending();
  }

  _refresh(){
    const self = this;

    return Promise.all(this._patterns.map((pattern) => {
      const options = Object.assign({ cwd: this._cwd }, constants.GLOB_OPTS);
      const stats = fg.sync(pathLib.normalize(pattern), options);
      if (isEmpty(stats)) {
        log.warn(`Pattern ${pattern} did not match any files.`);
        return;
      }

      return Promise.all(stats.map(({ path, mtime }) => {
        if (self._isExcluded(path)) {
          log.debug(`Excluded file ${path}`);
          return Promise.resolve();
        }

        const file = new File(path, mtime);

        return self._preprocess(file).then(() => {
          return file;
        });
      }))
      .then((files) => {
        files = compact(files);

        if (isEmpty(files)) {
          log.warn(`All files matched by ${pattern} were excluded.`);
        } else {
          self._files.set(pattern, files);
        }
      });
    }))
    .then(() => {
      self._emitModified(true);
      return self.files();
    })
    .catch(Promise.CancellationError, () => {
      return self._refreshing;
    });
  }
}

module.exports = FileList;
