const FileMap = require('./FileMap');
const PathResolver = require('./PathResolver');
const memoize = require('../util/memoize');

class DependencyGraph {
  constructor(root) {
    this.files = new FileMap();
    const resolver = new PathResolver(root);

    const resolve = (name, cwd) => resolver.createPathNode(name, cwd);
    const keyFn = (name, cwd) => `${cwd}/${name}`;    
    this.resolve = memoize(keyFn, resolve);
  }

  register(name, cwd) {
    const pathNode = this.resolve(name, cwd);
    if (!pathNode.valid()) {
      return;
    }

    const { path } = pathNode;
  
    if (!this.files.has(pathNode)) {
      this.files.add(pathNode);
    }

    const file = this.files.get(pathNode);
    if (!file.isStale()) {
      return;
    }

    file.refresh();
    file.getDependencies().forEach(p => {
      this.register(p, file.dirname);
    });
  }

  toArray() {
    return this.files.all();
  }
}

module.exports = DependencyGraph;
