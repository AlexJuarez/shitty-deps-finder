const FileStore = require('./store/FileStore');

class FileList {
  constructor() {
    this.store = new FileStore();

    this.has = this.has.bind(this);
    this.get = this.get.bind(this);
    this.add = this.add.bind(this);
  }

  add(file) {
    this.store.add(file.path, file);
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
