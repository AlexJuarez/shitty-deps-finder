class FileStore {
  constructor() {
    this.files = {};
  }

  get(file) {
    return this.files[file.path];
  }

  has(file) {
    return this.files[file.name] != null || this.files[file.path] != null;
  }

  add(file) {
    if (!this.has(file)) {
      this.files[file.path] = file;
    }
  }

  toArray() {
    return Object.values(this.files).map(f => f.valueOf());
  }
}

module.exports = FileStore;
