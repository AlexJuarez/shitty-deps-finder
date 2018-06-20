'use strict';

class File {
  constructor(path, mtime, doNotCache) {
    this.path = path;
    this.originalPath = path;
    this.contentPath = path;
    this.mtime = mtime;
    this.isUrl = false;
    this.doNotCache = doNotCache == null ? false : doNotCache;
  }

  static create(file) {
    const output = new File();
    
    Object.keys(file).forEach(key => {
      output[key] = file[key];
    });

    return output;
  }

  toString() {
    return this.path;
  }
}

module.exports = File;
