const DependencyGraph = require('./deps/DependencyGraph');
const VFS = require('./vfs');
const { getPkgRoot, setPkgRoot } = require('./deps/util/getPkgRoot');

module.exports = {
  DependencyGraph,
  VFS,
  getPkgRoot,
  setPkgRoot,
};
