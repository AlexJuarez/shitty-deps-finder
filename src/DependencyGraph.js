const FileList = require('./FileList');
const File = require('./store/File');
const Config = require('./Config');
const { getPkgRoot, setPkgRoot } = require('./util/getPkgRoot');
const { dirname, basename } = require('path');

const isExternal = file => ['builtin', 'external'].indexOf(file.type) !== -1;

const makeGraph = files => {
  const graph = {};

  files.forEach(file => {
    graph[file.path] = file.dependencies;
  });

  return graph;
};

class DependencyGraph {
  constructor(opts) {
    this.config = new Config(opts);
    this.files = new FileList();

    if (this.config.root) {
      setPkgRoot(this.config.root);
    }
  }

  summary(fp) {
    const dependencies = this.toArray();
    const relative = dependencies.filter(file => !isExternal(file));
    const absolute = dependencies.filter(isExternal);

    return {
      root: getPkgRoot(),
      filePath: fp,
      relative: relative.map(f => f.path),
      absolute: absolute.map(f => f.name),
      graph: makeGraph(relative),
    };
  }

  addPath(path) {
    if (this.files.has(path)) {
      return;
    }

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

  toArray() {
    return this.files.toArray();
  }
}

module.exports = DependencyGraph;
