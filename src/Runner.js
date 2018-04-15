const DependencyGraph = require('./DependencyGraph');
const { dirname, basename } = require('path');
const { getProfiles } = require('./util/profileFn');

class Runner {
  constructor() {
    this.dependencies = new DependencyGraph();
  }

  start(fp) {
    this.dependencies.add(dirname(fp), basename(fp), fp);
    console.log(this.dependencies.toArray().length);
    console.log(getProfiles());
  }
}

module.exports = Runner;
