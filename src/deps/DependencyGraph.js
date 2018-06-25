const FileList = require('./FileList');
const File = require('./store/File');
const Config = require('./Config');
const { setPkgRoot } = require('./util/getPkgRoot');
const { dirname, basename } = require('path');
const fs = require('graceful-fs');

class DependencyGraph {
  constructor(opts = {}) {
    this.config = new Config(opts);
    this.files = new FileList();

    if (this.config.root) {
      setPkgRoot(this.config.root);
    }
  }

  toGraph() {
    const files = this.files.toArray();
    const graph = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      file.dependencies.forEach(name => {
        const dep = this.files.getFile(file.cwd, name);

        if (graph[dep.path] == null) {
          graph[dep.path] = new Set();
        }

        graph[dep.path].add(file.path);
      });
    }

    return graph;
  }

  addPath(path) {
    const file = new File(dirname(path), basename(path), path);
    this.files.addFile(file);
  }

  add(cwd, name) {
    const file = new File(cwd, name);

    if (this.files.hasFile(file)) {
      return;
    }

    this.files.addFile(file);
  }

  hydrate() {
    if (!fs.existsSync(this.config.cacheFile)) {
      return;
    }

    const json = fs.readFileSync(this.config.cacheFile, 'utf8');
    JSON.parse(json).forEach(f => {
      this.files.addFile(new File(f.cwd, f.name, f.path, f.dependencies, f.type));
    });
  }

  dump() {
    const output = JSON.stringify(this.files.toArray().map(f => f.valueOf()));
    fs.writeFileSync(this.config.cacheFile, output);
  }

  toArray() {
    return this.files.toArray();
  }
}

module.exports = DependencyGraph;
