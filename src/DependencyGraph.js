const FileList = require('./FileList');
const File = require('./store/File');
const Config = require('./Config');
const { isBuiltIn, isExternalPath } = require('./util/resolve/types');

function filterBuiltIn(name) {
  return !isBuiltIn(name);
}

class DependencyGraph {
  constructor(opts) {
    this.config = new Config(opts);
    this.files = new FileList();
  }

  get(fp) {
    return this.files.get(fp).valueOf();
  }

  add(cwd, name, path) {
    const file = new File(cwd, name, path);
    
    if (this.files.hasFile(file)) {
      return;
    }
    
    this.files.addFile(file);

    if (!this.config.crawl || isExternalModule(name, cwd)) {
      console.log(file.valueOf());
      return;
    }

    this.crawl(file);
  }

  crawl(file) {
    file.dependencies.filter(filterBuiltIn).forEach(name => {
      this.add(file.dirname, name);
    });
  }

  toArray() {
    return this.files.toArray();
  }
}

module.exports = DependencyGraph;
