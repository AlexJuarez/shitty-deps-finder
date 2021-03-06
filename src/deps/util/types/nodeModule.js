const fs = require('graceful-fs');
const path = require('path');
const { getPkgRoot } = require('../../util/getPkgRoot');

const isNodeModule = (name) => {
  if (nodeModules == null) {
    nodePath = path.resolve(getPkgRoot(), 'node_modules');
  }

  return fs.existsSync(path.join(nodePath, name));
};

module.exports = isNodeModule;
