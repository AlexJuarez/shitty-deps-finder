class Config {
  constructor(opts) {
    this.cache = !opts.noCache;
    this.cacheFile = opts.cacheFile;
    this.crawl = !opts.noCrawl;
    this.types = opts.types;
    this.verbose = !!opts.verbose;

    console.log(this);
  }
}

module.exports = Config;
