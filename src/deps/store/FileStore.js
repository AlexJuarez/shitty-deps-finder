class FileStore {
  constructor() {
    this.files = {};
  }

  get(key) {
    return this.files[key];
  }

  has(key) {
    return this.files[key] != null;
  }

  add(key, file) {
    this.files[key] = file;
  }

  toArray() {
    return Object.values(this.files);
  }
}

module.exports = FileStore;
