const { dirname, extname } = require('path');
const fs = require('fs');
const Resolver = require('./resolve-imports');
const lazyFn = require('../util/lazyFn');

class PathNode {
  constructor(name, cwd, path) {
    this.name = name;
    this.cwd = cwd;
    this.path = path;

    this.valid = lazyFn(this.valid);
  }

  dirname() {
    return dirname(this.path);
  }

  ext() {
    return extname(this.path);
  }

  type() {
    const { cwd } = this;
    return Resolver(cwd).type(this.name);
  }

  resolve(path) {
    const { cwd } = this;    
    return Resolver(cwd).resolve(path);
  }

  isAbsolute() {
    const { cwd } = this;
    return Resolver(cwd).isAbsolute(this.name);
  }

  valid() {
    return () => this.path != null && fs.existsSync(this.path);
  }
}

module.exports = PathNode;
