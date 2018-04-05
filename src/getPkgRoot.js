const fs = require('fs');
const path = require('path');

const logger = require('./util/logger');
const log = logger.create('server-utils');

/* eslint import/no-dynamic-require: off */

let PKG_ROOT = null;

const findPkgRoot = (fp) => {
  let root = path.dirname(fp);
  while (root.length) {
    const pkgPath = path.resolve(root, 'package.json');

    if (fs.existsSync(pkgPath)) {
      return root;
    }
    root = path.dirname(root);
  }

  return root;
};

const getPkgRoot = (file) => {
  if (PKG_ROOT == null) {
    PKG_ROOT = findPkgRoot(file);
  }

  return PKG_ROOT;
}

module.exports = getPkgRoot;
