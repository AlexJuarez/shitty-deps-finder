const path = require('path');
const { setPkgRoot } = require('./src/util/getPkgRoot');
const Runner = require('./src/Runner');

const dependencyGraph = require('@irbnb/dependency-graph');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

const resolvePath = (file) => path.isAbsolute(file) ? path.resolve(file) : path.resolve(process.cwd(), file);

const Run = (file, opts) => {
  const fp = resolvePath(file);
  setPkgRoot(fp);

  const runner = new Runner(opts);
  runner.start(fp);
};

module.exports = Run;
