'use strict';

const Tracker = require('./tracker');
const Promise = require('bluebird');
const log = require('./logger');
const fs = require('graceful-fs');

const DEFAULT_OPTS = {
  watch: false,
  exclude: [],
  preprocess: (file) => {
    return new Promise((resolve) => {
      resolve();
    });
  }
};

class Index {
  static async(patterns, opts) {
    const config = Object.assign({ files: patterns }, DEFAULT_OPTS, opts);

    const tracker = new Tracker(config);

    if (opts.cacheFile && fs.existsSync(opts.cacheFile)) {
      const json = JSON.parse(fs.readFileSync(opts.cacheFile, 'utf8'));
      tracker.hydrate(json);
    }

    return new Promise((resolve, reject) => {
      tracker.once('changed', (files) => {
        if (opts.cacheFile) {
          fs.writeFileSync(opts.cacheFile, tracker.dumpStore());
        }

        resolve(files);
      });

      tracker.refresh();
    });
  }

  static watch(patterns, opts) {
    const config = Object.assign(DEFAULT_OPTS, { files: patterns, watch: true }, opts);

    const tracker = new Tracker(config);

    tracker.refresh();

    return tracker;
  }
}

module.exports = Index;
