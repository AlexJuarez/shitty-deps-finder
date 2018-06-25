const fs = require('fs');
const { join, normalize, dirname, extname, basename } = require('path');
const { getPkgRoot } = require('../util/getPkgRoot');
const memoize = require('../util/memoize');
const resolver = require('../util/resolve/index');
const { expandMonorail, expandProject } = require('../util/pathTransforms');
const { profileFn } = require('../util/profileFn');
const { isBuiltIn } = require('../util/resolve/types');

const exists = (path) => fs.existsSync(path);

const createPath = (...args) => normalize(join(...args));

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

let nodePath;
const isNodeModule = (c, n) => memoize((name) => {
  if (nodePath == null) {
    nodePath = createPath(getPkgRoot(), 'node_modules');
  }

  const path = join(nodePath, name);
  if (exists(path)) {
    return name;
  }
})(n);

const create = (cwd, name) => {
  if (isNodeModule(cwd, name)) {
    return name;
  }

  return createPath(cwd, applyTransforms(name));
};

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

  static create(cwd, name) {
    return create(cwd, name);
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

module.exports = Path;
