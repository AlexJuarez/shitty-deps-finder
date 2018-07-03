const FileList = require('./FileList');
const File = require('./store/File');
const Config = require('./Config');
const fs = require('graceful-fs');
const resolve = require('./util/resolve/virtual');

class DependencyGraph {
  constructor(opts = {}) {
    this.config = new Config(opts);
    this.files = new FileList();
  }

  toGraph() {
    const files = this.files.toArray();
    const graph = {};
    const self = this;

    const exists = self.files.has;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      file.dependencies.forEach(name => {
        const fp = resolve(file.cwd, name, exists, ['.js', '.jsx', '.ts', '.tsx']);

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
    this.files.add(file);
  }

  hydrate() {
    try {
      const json = fs.readFileSync(this.config.cacheFile, 'utf8');
      JSON.parse(json).forEach(f => {
        this.files.add(new File(f));
      });
    } catch (err) {
      console.log(`Could not load the cache from disk: ${this.config.cacheFile}`);
    }
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
