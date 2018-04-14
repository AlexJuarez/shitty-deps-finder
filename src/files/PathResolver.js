const path = require('path');
const fs = require('fs');
const PathNode = require('./PathNode');
const Resolver = require('./resolve-imports');

const readProjectConfig = (dir) => {
  const file = ['.projectrc', 'project.json5'].map(f => path.join(dir,f)).filter(fs.existsSync).shift();
  try {
    return file != null && JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
  } catch (err) {
    return {};
  }
}

const getProjectMainPath = (pathNode) => {
  const { name } = pathNode;

  const dir = path.resolve(pathNode.root, 'frontend', name.replace(':', ''));
  const config = readProjectConfig(dir);
  const { main } = config;
  return main != null ? path.join(dir, main) : dir;
};

const pathTypes = (pathNode) => {
  const { name, cwd } = pathNode;
  switch (pathNode.type()) {
    case 'builtin':
      pathNode.path = null;
      break;
    case 'project':
    case 'external':
      pathNode.path = name;
      break;
    default: {
      pathNode.path = pathNode.isAbsolute() ? name : path.resolve(cwd, name);
      break;
    }
  }
}

const expandPaths = (pathNode) => {
  const { name, root } = pathNode;

  pathNode.name = name.replace(':monorail', path.resolve(root, 'app/assets/javascripts'));

  if (pathNode.type(pathNode.name) !== 'project') {
    return;
  }
  
  pathNode.name = getProjectMainPath(pathNode);
}

const resolvePath = (pathNode) => {
  const { path, name } = pathNode;

  if (path != null && pathNode.isValid(path)) {
    pathNode.path = path;
  }

  pathNode.path = Resolver(pathNode.cwd).resolve(name);
}

class PathResolver {
  constructor() {
    this.fns = [];

    this.add(expandPaths);
    this.add(pathTypes);
    this.add(resolvePath);
  }

  add(middleware) {
    this.fns.push(middleware.bind(this));
  }

  createPathNode(name, cwd = '', root) {
    const pathNode = new PathNode(name, cwd, root);

    for (let i = 0; i < this.fns.length; i++) {
      const fn = this.fns[i];

      fn(pathNode);
    }

    return pathNode;
  }
}

module.exports = PathResolver;
