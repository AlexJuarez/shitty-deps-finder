const FileStore = require('./store/FileStore');
const File = require('./store/File');

class FileList {
  constructor() {
    this.store = new FileStore();
  }

  addFile(file) {
    this.store.add(file.path, file);
  }

  hasFile(file) {
    return this.store.has(file.path);
  }

  getFile(cwd, name) {
    const file = new File(cwd, name);

    return this.store.get(file.path) || file;
  }

  has(fp) {
    return this.store.has(fp);
  }

  get(fp) {
    return this.store.get(fp);
  }

  toArray() {
    return this.store.toArray();
  }
}

module.exports = FileList;
