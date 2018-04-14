const { dirname, extname } = require('path');
const throttle = require('lodash.throttle');
const fs = require('fs');

const getDependencies = require('./getDependencies');
 
class FileNode {
  constructor(pathNode) {
    this.pathNode = pathNode;
    const { path, type } = pathNode;
    this.path = path;
    this.type = type;
    this.dirname = dirname(path);
    this.ext = extname(path);
    this.isStale = throttle(this.isStale.bind(this), 100);
    this.mtime = null;
    this.source = null;
    this.dependencies = null;
  }

  isStale() {
    const mtime = this.lastModified();

    return this.mtime == null || mtime > this.mtime;
  }

  refresh() {
    this.mtime = this.lastModified();
    this.source = null;
    this.dependencies = null;
  }

  lastModified() {
    return fs.statSync(this.path).mtime;
  }
}

module.exports = FileNode;
