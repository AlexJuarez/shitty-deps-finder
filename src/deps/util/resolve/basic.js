const fs = require('graceful-fs');
const path = require('path');

const isBuiltIn = require('../types/builtIn');
const isNodeModule = require('../types/nodeModule');
const isProject = require('../types/projectrc');
const enhancedResolver = require('./enhanced');

const applyTransforms = require('../pathTransforms');

const checkExt = (ext) => (cwd, name) => {
  const path = path.resolve(cwd, name + ext);

  if (fs.existsSync(path)) {
    return path;
  }
};

const resolve = (cwd, name, extensions = ['.js', '.jsx']) => {
  // check if its a node lib path, fs etc first
  if (isBuiltIn(name)) {
    return name;
  }

  const expandedName = applyTransforms(name);
  const nameHasAlias = expandedName !== name;

  // if the path doesn't expand it might a node_module
  if (!nameHasAlias && isNodeModule(name)) {
    return name;
  }

  // when path == null when it does not exist
  const possiblePaths = extensions.map(checkExt);
  while (possiblePaths.length) {
    const fn = possiblePaths.shift();
    const path = fn(cwd, expandedName);
    if (path != null) {
      return path;
    }
  }

  const path = nameHasAlias && isProject(expandedName);

  if (path != null) {
    return path;
  }

  return enhancedResolver(cwd, expandedName);
};

module.exports = resolve;
