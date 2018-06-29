#!/usr/bin/env node
const program = require('commander');

const pkg = require('./../package.json');
const Run = require('./../run');

program
  .version(pkg.version);

program
  .usage('<file> [options]')
  .option('--no-cache', 'Don\'t use a local cache')
  .option('--cache-file <cache>', 'cache filename', '/tmp/.df.cache.json')
  .option('--no-crawl', 'don\'t crawl dependencies')
  .option('-v, --verbose', 'Output console log messages')
  .action((file, opts) => {
    Run(file, opts);
  });

program.parse(process.argv);
