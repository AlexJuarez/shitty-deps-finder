const DependencyGraph = require('./deps/DependencyGraph');
const VFS = require('./vfs');
const { getProfiles } = require('./deps/util/profileFn');
const { getPkgRoot } = require('./deps/util/getPkgRoot');

class Runner {
  constructor(opts) {
    this.deps = new DependencyGraph(opts);
  }

  start(fp) {
    VFS.async(['**/*.js'], { cwd: getPkgRoot(), exclude: ['**/node_modules/**'] }).then((files) => {
      files.forEach(file => this.deps.addPath(file.path));
      console.log(`found ${files.length} files`);
      console.log(this.deps.summary(fp));
      getProfiles();
    });
  }
}

module.exports = Runner;
