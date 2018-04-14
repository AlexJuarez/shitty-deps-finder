#!/usr/bin/env node
const program = require('commander');

const pkg = require('./../package.json');
const Run = require('./../run');

program
  .version(pkg.version);

program
  .usage('<file>')
  .action((file) => {
    Run(file);
  });

program.parse(process.argv);
