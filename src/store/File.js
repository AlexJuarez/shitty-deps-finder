const Path = require('./Path');
const getSource = require('../util/getSource');
const getDependencies = require('../util/getDependencies');
const fs = require('fs');

class File {
  constructor(cwd, name, path, source, dependencies) {
    this._path = new Path(cwd, name, path);
    this._source = source;
    this._dependencies = dependencies;
  }

  get source() {
    if (this._source == null) {
      this._source = getSource(this.path);
    }

    return this._source;
  }

  get dependencies() {
    if (this._dependencies == null) {
      this._dependencies = getDependencies(this.source);
    }

    return this._dependencies;
  }

  get dirname() {
    return this._path.dir;
  }

  get extname() {
    return this._path.ext;
  }

  get cwd() {
    return this._path.cwd;
  }

  get path(){
    return this._path.path;
  }

  get name(){
    return this._path.name;
  }

  valueOf() {
    return {
      path: this.path,
      cwd: this.cwd,
      name: this.name,
      dependencies: this.dependencies,
    };
  }
}

module.exports = File;
