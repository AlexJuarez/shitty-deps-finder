const { dirname, extname, basename } = require('path');
const resolve = require('../util/resolve/basic');

class Path {
  constructor({ cwd, name, path }) {
    this.path = path;

    if (this.path == null) {
      this.path = resolve(cwd, name);
    }
  }

  get basename() {
    return basename(this.path);
  }

  get dirname() {
    return dirname(this.path);
  }

  get extname() {
    return extname(this.path);
  }
}

module.exports = Path;
