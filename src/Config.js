class Config {
  constructor(opts) {
    this.cache = !opts.noCache;
    this.cacheFile = opts.cacheFile;
    this.crawl = !opts.noCrawl;
    this.types = opts.types || ['internal', 'parent', 'index', 'sibling', 'absolute'];
    this.verbose = !!opts.verbose;
    this.resolver = opts.resolver || ((...args) => null);
    this.root = opts.root;
  }
}

module.exports = Config;
