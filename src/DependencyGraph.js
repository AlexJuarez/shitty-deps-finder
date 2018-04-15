const FileList = require('./FileList');
const File = require('./store/File');
const resolver = require('./util/resolve-imports');

class DependencyGraph {
  constructor() {
    this.files = new FileList();
  }

  add(cwd, name, path) {
    const file = new File(cwd, name, path);
    
    if (!this.files.hasFile(file)) {
      this.files.addFile(file);
      this.crawl(file);
    }
  }

  crawl(file) {
    file.dependencies.filter(name => !resolver().isBuiltIn(name)).forEach(name => {
      this.add(file.dirname, name);
    });
  }

  toArray() {
    return this.files.toArray();
  }
}

module.exports = DependencyGraph;
