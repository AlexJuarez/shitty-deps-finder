const Path = require('./Path');
const getSource = require('../util/getSource');
const getDependencies = require('../util/getDependencies');
const { type } = require('../util/resolve/types');

class File {
  constructor(cwd, name, path, dependencies, type) {
    this._path = new Path(cwd, name, path);
    this._dependencies = dependencies;
    this._type = type;
    this._source = null;
  }

  get source() {
    if (this._source == null) {
      this._source = getSource(this.path);
    }

    return this._source;
  }

  get dependencies() {
    if (this._dependencies == null) {
      this._dependencies = getDependencies(this.path, this.source);
    }

    return this._dependencies;
  }

  get basename() {
    return this._path.basename;
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

  get type(){
    if (this._type == null) {
      this._type = type(this.name, this.path);
    }

    return this._type;
  }

  valueOf() {
    return {
      path: this.path,
      cwd: this.cwd,
      name: this.name,
      dependencies: this.dependencies,
      type: this.type,
    };
  }
}

module.exports = File;
