const FileNode = require('./FileNode');

class FileStore {
  constructor() {
    this.files = {};
  }

  get(file) {
    return this.files[file.path];
  }

  has(file) {
    return this.files[file.path] != null;
  }

  add(file) {
    if (!this.has(file)) {
      this.files[file.path] = file;
    }
  }

  toArray() {
    return Object.values(this.files);
  }
}

module.exports = FileStore;
