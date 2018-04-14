const fs = require('fs');
const Resolver = require('./resolve-imports');

class PathNode {
  constructor(name, cwd, root, path) {
    this.name = name;
    this.cwd = cwd;
    this.root = root;
    this.path = path;
  }

  type() {
    return Resolver(this.cwd).type(this.name);
  }

  isAbsolute() {
    return Resolver(this.cwd).isAbsolute(this.name);
  }

  isValid() {
    return this.path != null && fs.existsSync(this.path);
  }
}

module.exports = PathNode;
