const fs = require('graceful-fs');
const path = require('path');

const applyTransforms = require('../pathTransforms');

const fsExists = (fp) => fs.existsSync(fp);

const checkExt = (ext, exists) => (cwd, name) => {
  const fp = path.resolve(cwd, name + ext);

  if (exists(fp)) {
    return fp;
  }
};

const resolve = (cwd, name, exists = fsExists, extensions = ['.js', '.jsx', '.ts', '.tsx']) => {
  const expandedName = applyTransforms(name);

  // when path == null when it does not exist
  const possiblePaths = extensions.map((ext) => checkExt(ext, exists));
  while (possiblePaths.length) {
    const fn = possiblePaths.shift();
    const fp = fn(cwd, expandedName);
    if (fp != null) {
      return fp;
    }
  }

  return expandedName;
};

module.exports = resolve;
