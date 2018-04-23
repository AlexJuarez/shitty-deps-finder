const DependencyGraph = require('./DependencyGraph');
const { dirname, basename } = require('path');
const { getProfiles } = require('./util/profileFn');

class Runner {
  constructor(opts) {
    this.dependencies = new DependencyGraph(opts);
  }

  start(fp) {
    this.dependencies.add(dirname(fp), basename(fp), fp);
    const dependencies = this.dependencies.toArray();
    console.log(`found ${dependencies.length} dependencies`);
    console.log(this.dependencies.getGraph(fp));
  }
}

module.exports = Runner;
