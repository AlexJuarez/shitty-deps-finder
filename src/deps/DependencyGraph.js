const FileList = require('./FileList');
const File = require('./store/File');
const Config = require('./Config');
const { setPkgRoot } = require('./util/getPkgRoot');
const fs = require('graceful-fs');
const resolve = require('./util/resolve/virtual');

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
    const self = this;
    const graph = {};

    const exists = (path) => self.files.has(path);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      file.dependencies.forEach(name => {
        const fp = resolve(file.cwd, name, exists, ['.js', '.jsx', '.ts', '.tsx']);

        if (!this.files.has(fp)) {
          return;
        }

        if (graph[fp] == null) {
          graph[fp] = new Set();
        }

        graph[fp].add(file.path);
      });
    }

    return graph;
  }

  addPath(path) {
    const file = new File({ path });
    this.files.addFile(file);
  }

  hydrate() {
    if (!fs.existsSync(this.config.cacheFile)) {
      return;
    }

    const json = fs.readFileSync(this.config.cacheFile, 'utf8');
    JSON.parse(json).forEach(f => {
      this.files.addFile(new File({ path: f.path }, f.dependencies));
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
