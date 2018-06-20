const FileList = require('./FileList');
const File = require('./store/File');
const Config = require('./Config');
const { getPkgRoot, setPkgRoot } = require('./util/getPkgRoot');
const { dirname, basename } = require('path');
const mm = require('minimatch');

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

  isExcluded(file) {
    return this.config.excludes.some(pattern => mm(file.path, pattern));
  }

  getAllDependencies(fp) {
    const files = new FileList();
    const queue = [new File(dirname(fp), basename(fp), fp)];
    while (queue.length) {
      let file = queue.pop();

      if (files.hasFile(file) || this.isExcluded(file)) {
        continue;
      }

      if (this.files.hasFile(file)) {
        file = this.files.get(file.path);
      }
      files.addFile(file);
      const cwd = dirname(file.path);
      file.dependencies.forEach(name => {
        const dep = new File(cwd, name);
        queue.push(dep);
      });
    }

    return files.toArray();
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
