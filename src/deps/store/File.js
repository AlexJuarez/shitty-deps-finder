const Path = require('./Path');
const getSource = require('../util/getSource');
const getDependencies = require('../util/getDependencies');

class File {
  constructor({ cwd, name, path }, dependencies) {
    this._path = new Path({cwd, name, path});
    this._dependencies = dependencies;
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

  get path(){
    return this._path.path;
  }

  get cwd() {
    return this._path.dirname;
  }

  get ext() {
    return this._path.extname;
  }

  valueOf() {
    return {
      path: this.path,
      dependencies: this.dependencies,
    };
  }
}

module.exports = File;
