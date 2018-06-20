const Path = require('./Path');
const getSource = require('../util/getSource');
const getDependencies = require('../util/getDependencies');
const { type } = require('../util/resolve/types');
const { getPkgRoot } = require('../util/getPkgRoot');

const getRelative = path => path && path.replace(getPkgRoot(), '.');

class File {
  constructor(cwd, name, path, source, dependencies) {
    this._path = new Path(cwd, name, path);
    this._source = source;
    this._dependencies = dependencies;
    this._type;
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
      path: getRelative(this.path),
      cwd: getRelative(this.cwd),
      name: this.name,
      dependencies: this.dependencies,
      type: this.type,
    };
  }
}

module.exports = File;
