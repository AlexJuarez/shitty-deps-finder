const throttle = require('lodash.throttle');
const fs = require('fs');

const getDependencies = require('./getDependencies');
const lazyFn = require('../util/lazyFn');
 
class FileNode {
  constructor(pathNode) {
    this.path = pathNode;
    
    this.mtime = null;
    this.source = null;
    this.dependencies = null;
  }

  isStale() {
    const mtime = this.lastModified();
    const stale = this.mtime == null || mtime > this.mtime;
    this.mtime = mtime;

    return stale;
  }

  lastModified() {
    return fs.statSync(this.path).mtime;
  }
}

module.exports = FileNode;
