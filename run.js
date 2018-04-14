const path = require('path');
const logger = require('./src/util/logger');
const getPkgRoot = require('./src/getPkgRoot');

const DependencyGraph = require('./src/files/DependencyGraph');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

const resolvePath = (file) => path.isAbsolute(file) ? path.resolve(file) : path.resolve(process.cwd(), file);

const Run = (file) => {
  const fp = resolvePath(file);
  const PKG_ROOT = getPkgRoot(fp);

  const dependencyGraph = new DependencyGraph(PKG_ROOT);
  
  dependencyGraph.register(file, PKG_ROOT);
};

module.exports = Run;
