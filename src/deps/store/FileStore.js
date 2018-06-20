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
    if (!this.has(key)) {
      this.files[key] = file;
    }
  }

  toArray() {
    return Object.values(this.files).map(f => f.valueOf());
  }
}

module.exports = FileStore;
