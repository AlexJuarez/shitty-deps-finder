const FileStore = require('./store/FileStore');
const File = require('./store/File');
const path = require('path');
const { profileFn } = require('./util/profileFn');

const keyFn = (cwd, name) => {
  return path.normalize(cwd, name);
};

class FileList {
  constructor() {
    this.store = new FileStore();
  }

  addFile(file) {
    const key = keyFn(file.cwd, file.name);

    this.store.add(key, file);
    this.store.add(file.path, file);
  }

  hasFile(file) {
    return this.store.has(file.name) || this.store.has(file.path);
  }

  getFile(cwd, name) {
    if (this.store.has(name)) {
      return this.store.get(name);
    }

    const key = keyFn(cwd, name);
    if (this.store.has(key)) {
      return this.store.get(key);
    }

    const file = new File(cwd, name);
    return this.get(file.path) || file;
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
