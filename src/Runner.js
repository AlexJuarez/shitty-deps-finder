const DependencyGraph = require('./deps/DependencyGraph');
const VFS = require('./vfs');
const { getProfiles } = require('./deps/util/profileFn');
const { getPkgRoot } = require('./deps/util/getPkgRoot');

class Runner {
  constructor(opts) {
    this.deps = new DependencyGraph(opts);
  }

  start(fp) {
    VFS.async(['frontend/**/*.{js,jsx}'], { cwd: getPkgRoot() }).then((files) => {
      files.forEach(file => this.deps.addPath(file.path));
      console.log(`found ${files.length} files`);
      console.log(this.deps.getAllDependencies(fp));
      getProfiles();
    });
  }
}

module.exports = Runner;
