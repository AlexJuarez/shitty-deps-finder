const DependencyGraph = require('./DependencyGraph');
const { dirname, basename } = require('path');
const { getProfiles } = require('./util/profileFn');

class Runner {
  constructor() {
    this.dependencies = new DependencyGraph();
  }

  start(fp) {
    this.dependencies.add(dirname(fp), basename(fp), fp);
    console.log(`found ${this.dependencies.toArray().length} dependencies`);
    console.log(getProfiles());
  }
}

module.exports = Runner;
