const File = require('./store/File');
const FileStore = require('./store/FileStore');

class FileList {
  constructor() {
    this.store = new FileStore();
  }

  addFile(file) {
    this.store.add(file);
  }

  getFile(file) {
    return this.store.get(file);
  }

  hasFile(file) {
    return this.store.has(file);
  }

  add(cwd, name) {
    const file = new File(cwd, name);
    this.store.add(file);
  }

  has(cwd, name) {
    const file = new File(cwd, name);
    return this.store.has(file);
  }

  get(cwd, name) {
    const file = new File(cwd, name);
    return this.store.get(file);
  }

  toArray() {
    return this.store.toArray();
  }
}

module.exports = FileList;
