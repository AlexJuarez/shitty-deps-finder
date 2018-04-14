const path = require('path');
const fs = require('fs');
const PathNode = require('./PathNode');

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
      return name;
    case 'project':
    case 'external':
      return name;
    default: {
      return pathNode.isAbsolute(name) ? name : path.resolve(cwd, name);
    }
  }
}

const expandPaths = (root) => (pathNode) => {
  const { name } = pathNode;

  pathNode.name = name.replace(':monorail', path.resolve(root, 'app/assets/javascripts'));

  if (pathNode.type(pathNode.name) !== 'project') {
    return;
  }
  
  pathNode.name = getProjectMainPath(pathNode);
}

const resolvePath = (pathNode) => {
  const path = pathTypes(pathNode);

  if (path != null && !pathNode.valid()) {
    pathNode.path = pathNode.resolve(path);
  }

  pathNode.path = path;
}

class PathResolver {
  constructor(root) {
    this.fns = [];

    this.add(expandPaths(root));
    this.add(resolvePath);
  }

  add(middleware) {
    this.fns.push(middleware.bind(this));
  }

  createPathNode(name, cwd = '') {
    const pathNode = new PathNode(name, cwd);

    for (let i = 0; i < this.fns.length; i++) {
      const fn = this.fns[i];

      fn(pathNode);
    }

    return pathNode;
  }
}

module.exports = PathResolver;
