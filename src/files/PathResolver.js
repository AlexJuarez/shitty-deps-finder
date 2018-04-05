const path = require('path');
const fs = require('fs');

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

class Path {
  constructor(name, cwd, resolver, root) {
    this.name = name;
    this.cwd = cwd;
    this.root = root;
    this.type = (name) => resolver.type(name);
    this.path = name;
    this.resolve = (path) => resolver.resolve(path);
    this.isAbsolute = (name) => resolver.isAbsolute(name);
  }

  valid() {
    return this.path != null && fs.existsSync(this.path);
  }
}

const pathTypes = (pathNode) => {
  const { name, cwd } = pathNode;
  switch (pathNode.type(name)) {
    case 'builtin':
      pathNode.path = null;
      break;
    case 'project':
    case 'external':
      pathNode.path = name;
      break;
    default: {
      pathNode.path = pathNode.isAbsolute(name) ? name : path.resolve(cwd, name);
      break;
    }
  }
}

const expandPaths = (pathNode) => {
  const { name } = pathNode;

  pathNode.name = name.replace(':monorail', path.resolve(pathNode.root, 'app/assets/javascripts'));

  if (pathNode.type(pathNode.name) !== 'project') {
    return;
  }
  
  pathNode.name = getProjectMainPath(pathNode);
}

const resolvePath = (pathNode) => {
  const { path } = pathNode;
  if (path != null) {
    pathNode.path = pathNode.resolve(path);
  }
}

class PathResolver {
  constructor(root) {
    this.root = root;
    this.resolver = Resolver(root);
    this.fns = [];

    this.add(expandPaths);
    this.add(pathTypes);
    this.add(resolvePath);
  }

  add(middleware) {
    this.fns.push(middleware.bind(this));
  }

  createPathNode(name, cwd = '') {
    const pathNode = new Path(name, cwd, this.resolver, this.root);

    for (let i = 0; i < this.fns.length; i++) {
      const fn = this.fns[i];

      fn(pathNode);
    }

    return pathNode;
  }
}

module.exports = PathResolver;
