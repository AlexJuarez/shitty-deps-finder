const pathLib = require('path');
const { dirname, extname, basename } = pathLib;
const resolve = require('../util/resolve/basic');
const applyTransforms = require('../util/pathTransforms');

class Path {
  constructor({ cwd, name, path }) {
    this.path = path;

    if (this.path == null) {
      this.path = resolve(cwd, name);
    }
  }

  static normalize(cwd, name) {
    const expandedName = applyTransforms(name);

    return expandedName === name ? pathLib.resolve(cwd, name) : expandedName;
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
