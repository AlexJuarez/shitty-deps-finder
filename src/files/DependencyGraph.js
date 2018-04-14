const FileMap = require('./FileMap');
const PathResolver = require('./PathResolver');
const PathNode = require('./PathNode');
const memoize = require('../util/memoize');
const Manager = require('./Manager');

class DependencyGraph {
  constructor(root) {
    this.files = new FileMap();
    this.manager = new Manager(root, this.done.bind(this));
    this.start = new Date();
  }

  done() {
    console.log(this.toArray());
    console.log(`time: ${new Date() - this.start}ms`);
  }

  add(name, cwd, path, source, dependencies) {
    const pathNode = new PathNode(name, cwd, path);
    
    if (!this.files.has(pathNode)) {
      this.files.add(pathNode);
    }

    const file = this.files.get(pathNode);
    file.source = source;
    file.dependencies = dependencies;

    return file;
  }

  register(name, cwd) {
    const done = ({ name, cwd, path, source, dependencies }) => {
      const file = this.add(name, cwd, path, source, dependencies);

      dependencies.forEach(p => {
        this.register(p, cwd);
      });
    };

    this.manager.add({ name, cwd }, done);
  }

  toArray() {
    return this.files.all();
  }
}

module.exports = DependencyGraph;
