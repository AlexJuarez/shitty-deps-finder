'use strict';

class File {
  constructor(path, mtime, doNotCache) {
    this.path = path;
    this.originalPath = path;
    this.mtime = mtime;
    this.isUrl = false;
    this.doNotCache = doNotCache == null ? false : doNotCache;
  }

  static create(file) {
    const output = new File();

    Object.keys(file).forEach(key => {
      output[key] = file[key];
    });

    output.mtime = Date.parse(file.mtime);

    return output;
  }

  toString() {
    return this.path;
  }
}

module.exports = File;
