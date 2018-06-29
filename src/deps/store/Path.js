const fs = require('fs');
const { resolve: fpResolve, join, dirname, extname, basename } = require('path');
const { getPkgRoot } = require('../util/getPkgRoot');
const memoize = require('../util/memoize');
const resolver = require('../util/resolve/index');
const { expandMonorail, expandProject } = require('../util/pathTransforms');
const { profileFn } = require('../util/profileFn');
const { isBuiltIn } = require('../util/resolve/types');

const exists = (path) => fs.existsSync(path);

const createPath = (...args) => fpResolve(...args);

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
};

const isNodeModule = (c, n) => memoize((name) => {
  if (nodePath == null) {
    nodePath = createPath(getPkgRoot(), 'node_modules');
  }

  const path = join(nodePath, name);
  if (exists(path)) {
    return name;
  }
})(n);

const isExt = (ext) => (cwd, name) => {
  const path = createPath(cwd, name + ext);
  if (exists(path)) {
    return path;
  }
};

const resolve = profileFn(memoize((cwd, name) => {
  if (isBuiltIn(name)) {
    return name;
  }

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

  static normalize(cwd, name) {
    return createPath(cwd, applyTransforms(name));
  }

  get basename() {
    return basename(this.path);
  }

  get dir() {
    return dirname(this.path);
  }

  get ext() {
    return extname(this.path);
  }
}

Path.normalize = profileFn(Path.normalize, 'Path.normalize');

module.exports = Path;
