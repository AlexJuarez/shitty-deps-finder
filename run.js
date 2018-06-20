const path = require('path');
const { setPkgRoot } = require('./src/deps/util/getPkgRoot');
const Runner = require('./src/Runner');

const resolvePath = (file) => path.isAbsolute(file) ? path.resolve(file) : path.resolve(process.cwd(), file);

const Run = (file, opts) => {
  const fp = resolvePath(file);
  setPkgRoot(fp);

  const runner = new Runner(opts);
  runner.start(fp);
};

module.exports = Run;
