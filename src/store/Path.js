const fs = require('fs');
const path = require('path');
const { dirname, extname } = require('path');
const { getPkgRoot } = require('../util/getPkgRoot');
const memoize = require('../util/memoize');
const resolver = require('../util/resolve');
const { expandMonorail, expandProject } = require('../util/pathTransforms');
const { profileFn } = require('../util/profileFn');

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
  const path = createPath(getPkgRoot(), 'node_modules', name);
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

const resolve = profileFn(memoize((cwd, name) => {
  const possiblePaths = [
    isExt('.js'),
    isExt('.jsx'),
    isNodeModule,
  ];
  const resolvedName = applyTransforms(name); 

  while (possiblePaths.length) {
    const fn = possiblePaths.shift();
    const path = fn(cwd, resolvedName);
    if (exists(path)) {
      return path;
    }
  }

  return resolver(cwd, resolvedName);
}), 'resolve');

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
