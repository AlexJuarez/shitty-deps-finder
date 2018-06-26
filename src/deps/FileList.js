const FileStore = require('./store/FileStore');
const File = require('./store/File');
const Path = require('path');

const keyFn = (cwd, name) => {
  return Path.normalize(cwd, name);
};

class FileList {
  constructor() {
    this.store = new FileStore();
  }

  addFile(file) {
    const key = keyFn(file.cwd, file.name);

    if (file.path.indexOf('PhotoMosaic') > -1) {
      console.log(key);
    }

    this.store.add(key, file);
  }

  hasFile(file) {
    const key = keyFn(file.cwd, file.name);
    return this.store.has(key);
  }

  getFile(cwd, name) {
    const key = keyFn(cwd, name);
    if (this.store.has(key)) {
      return this.store.get(key);
    }

    return new File(cwd, name);
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
