const DependencyGraph = require('./DependencyGraph');

class Runner {
  constructor() {
    this.dependencies = new DependencyGraph();
  }

  start(cwd, name) {
    this.dependencies.add(cwd, name);
  }
}