const DependencyGraph = require('./src/deps/DependencyGraph');
const VFS = require('./src/vfs');
const { getPkgRoot, setPkgRoot } = require('./src/deps/util/getPkgRoot');

module.exports = {
  DependencyGraph,
  VFS,
  getPkgRoot,
  setPkgRoot,
};
