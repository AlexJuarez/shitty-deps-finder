const DependencyGraph = require('./DependencyGraph');
const { dirname, basename } = require('path');
const { getProfiles } = require('./util/profileFn');

class Runner {
  constructor(opts) {
    this.dependencies = new DependencyGraph(opts);
  }

  start(fp) {
    this.dependencies.add(dirname(fp), basename(fp), fp);
    console.log(`found ${this.dependencies.toArray().length} dependencies`);
    console.log(this.dependencies.toArray());
    console.log(getProfiles());
  }
}

module.exports = Runner;
