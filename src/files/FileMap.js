const FileNode = require('./FileNode');

class FileMap {
  constructor() {
    this.files = {};
  }

  get({ path }) {
    return this.files[path];
  }

  has({ path }) {
    return this.files[path] != null;
  }

  add(pathNode) {
    const { path } = pathNode;

    if (!this.has(path)) {
      this.files[path] = new FileNode(pathNode);
    }
  }

  all() {
    return Object.values(this.files);
  }
}

module.exports = FileMap;
