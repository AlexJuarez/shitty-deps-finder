const FileMap = require('./FileMap');
const PathResolver = require('./PathResolver');
const PathNode = require('./PathNode');
const memoize = require('../util/memoize');
const Manager = require('./Manager');
const { normalize, join, extname } = require('path');

class DependencyGraph {
  constructor(root) {
    this.files = new FileMap();
    const done = () => {
      console.log(this.files.all());
      console.log(`time: ${new Date() - this.start}ms`);
    };

    this.manager = new Manager(root, done);
    this.start = new Date();
    this.root = root;
    this.visited = {};

    const keyFn = (name, cwd) => `${name}/${cwd}`;
    this.register = memoize(keyFn, this.register.bind(this));
  }

  shouldVisit(cwd, name) {
    const jp = normalize(join(cwd, name));

    return this.visited[jp] == null && this.visited[name] == null;
  }

  visit(pathNode) {
    const { path, name, ext } = pathNode;

    if (path.indexOf('node_modules') > -1) {
      this.visited[name] = true;
    }
    
    this.visited[path.slice(0, -(ext || '').length)] = true;
  }

  add(name, cwd, path, source, dependencies) {
    const pathNode = new PathNode(name, cwd, this.root, path);
    this.visit(pathNode);

    if (!this.files.has(pathNode)) {
      this.files.add(pathNode);
    }
    
    const file = this.files.get(pathNode);
    file.source = source;
    file.dependencies = dependencies;

    return file;
  }

  done({ name, cwd, path, source, dependencies }) {
    const file = this.add(name, cwd, path, source, dependencies);

    dependencies.forEach(p => {
      this.register(p, file.dirname);
    });
  }

  register(name, cwd) {
    if (!this.shouldVisit(cwd, name)) {
      return;
    }

    this.manager.add({ name, cwd }, this.done.bind(this));
  }

  toArray() {
    return this.files.all();
  }
}

module.exports = DependencyGraph;
