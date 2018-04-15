const FileList = require('./FileList');
const File = require('./store/File');

class DependencyGraph {
  constructor() {
    this.files = new FileList();
  }

  add(cwd, name) {
    const file = new File(cwd, name);
    
    if (!this.files.hasFile(file)) {
      this.crawl(file);
      this.files.addFile(file);
    }

    return this.files.getFile(file);
  }

  crawl(file) {
    file.dependencies.forEach(name => {
      this.add(file.dirname, name);
    });
  }

  toArray() {
    return this.files.all();
  }
}

module.exports = DependencyGraph;
