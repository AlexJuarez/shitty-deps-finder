const fs = require('graceful-fs');
const path = require('path');

/* eslint import/no-dynamic-require: off */

let PKG_ROOT = null;

const findPkgRoot = (fp) => {
  let root = fp;
  while (root.length) {
    const pkgPath = path.resolve(root, 'package.json');

    if (fs.existsSync(pkgPath)) {
      return root;
    }
    root = path.dirname(root);
  }

  return root;
};

const setPkgRoot = (file) => {
  if (PKG_ROOT == null) {
    PKG_ROOT = findPkgRoot(file);
  }
};

const getPkgRoot = () => {
  return PKG_ROOT;
};

module.exports =  {
  getPkgRoot,
  setPkgRoot
};
