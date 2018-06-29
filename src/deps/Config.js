class Config {
  constructor(opts) {
    this.cacheFile = opts.cacheFile || '/tmp/.cache.json';
    this.verbose = !!opts.verbose;
    this.resolver = opts.resolver || ((...args) => null);
    this.root = opts.root;
    this.excludes = opts.excludes;
  }
}

module.exports = Config;
