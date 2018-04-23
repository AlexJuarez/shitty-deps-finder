const File = require('./store/File');
const FileStore = require('./store/FileStore');

class FileList {
  constructor() {
    this.store = new FileStore();
  }

  addFile(file) {
    this.store.add(file.path, file);
  }

  hasFile(file) {
    return this.store.has(file.name) || this.store.has(file.path);
  }

  get(fp) {
    return this.store.get(fp);
  }

  toArray() {
    return this.store.toArray();
  }
}

module.exports = FileList;
