const fs = require('fs');
const path = require('path');
const { dirname, extname } = require('path');
const getPkgRoot = require('../util/getPkgRoot');
const memoize = require('../util/memoize');
const resolver = require('../util/resolve-imports')();
const { expandMonorail, expandProject } = require('../util/pathTransforms')

const exists = (path) => fs.existsSync(path);

const createPath = (...args) => path.normalize(path.join(...args));

const applyTransforms = (name) => {
  const fns = [
    expandMonorail,
    expandProject,
  ];

  let result = name;
  while (fns.length) {
    const fn = fns.shift();
    result = fn(result);
  }

  return result;
}

const isNodeModule = (cwd, name) => {
  const path = createPath(getPkgRoot(cwd), 'node_modules', name);
  if (exists(path)) {
    return name;
  }
}

const isExt = (ext) => (cwd, name) => {
  const path = createPath(cwd, name + ext);
  if (exists(path)) {
    return path;
  }
}

const resolve = memoize((cwd, name) => {
  const possiblePaths = [
    isExt('.js'),
    isExt('.jsx'),
    isNodeModule,
    resolver.resolve,
  ];

  while (possiblePaths.length) {
    const fn = possiblePaths.shift();
    const resolvedName = applyTransforms(name); 
    const path = fn(cwd, resolvedName);
    if (path != null) {
      return path;
    }
  }

  console.error(`could not locate ${name} in ${cwd}`);
  return name;
});

class Path {
  constructor(cwd, name, path = resolve(cwd, name)) {
    this.cwd = cwd;
    this.name = name;
    this.path = path;
  }

  get dir() {
    return dirname(this.path);
  }

  get ext() {
    return extname(this.path);
  }
}

module.exports = Path;
