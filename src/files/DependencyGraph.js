const FileMap = require('./FileMap');
const PathResolver = require('./PathResolver');
const memoize = require('../util/memoize');
const Manager = require('./Manager');

class DependencyGraph {
  constructor(root) {
    this.files = new FileMap();
    const resolver = new PathResolver(root);

    const resolve = (name, cwd) => resolver.createPathNode(name, cwd);
    const keyFn = (name, cwd) => `${cwd}/${name}`;
    this.resolve = memoize(keyFn, resolve);
    this.manager = new Manager(this.done.bind(this));
    this.start = new Date();
  }

  done() {
    console.log(this.toArray());
    console.log(`time: ${new Date() - this.start}ms`);
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

    const done = ({ source, dependencies}) => {
      file.source = source;
      file.dependencies = dependencies;
      dependencies.forEach(p => {
        this.register(p, file.dirname);
      });
    };

    this.manager.add(file.path, done);
  }

  toArray() {
    return this.files.all();
  }
}

module.exports = DependencyGraph;
