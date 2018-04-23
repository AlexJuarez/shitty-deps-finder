const FileList = require('./FileList');
const File = require('./store/File');
const Config = require('./Config');
const { getPkgRoot } = require('./util/getPkgRoot');

const isExternal = file => ['builtin', 'external'].indexOf(file.type) !== -1;

const makeGraph = files => {
  const graph = {};

  files.forEach(file => {
    graph[file.path] = file.dependencies;
  });

  return graph;
}

class DependencyGraph {
  constructor(opts) {
    this.config = new Config(opts);
    this.files = new FileList();
  }

  summary(fp) {
    const dependencies = this.toArray();
    const relative = dependencies.filter(file => !isExternal(file));
    const absolute = dependencies.filter(isExternal);

    return {
      root: getPkgRoot(),
      filePath: fp,
      relative: relative.map(f => f.path),
      absolute: absolute.map(f => f.name),
      graph: makeGraph(relative),
    };
  }

  add(cwd, name, path) {
    const file = new File(cwd, name, this.config.resolver(cwd, name) || path);
    
    if (this.files.hasFile(file)) {
      return;
    }
    
    this.files.addFile(file);

    const { types } = this.config;
    if (!this.config.crawl || types.indexOf(file.type) === -1) {
      return;
    }

    this.crawl(file);
  }

  crawl(file) {
    file.dependencies.forEach(name => {
      this.add(file.dirname, name);
    });
  }

  toArray() {
    return this.files.toArray();
  }
}

module.exports = DependencyGraph;
