const { join } = require('path');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');
const { getPkgRoot } = require('../getPkgRoot');
const fs = require('fs');
const memoize = require('../memoize');

let resolver;
let opts;

module.exports = memoize((cwd, name) => {
  if (opts == null) {
    opts = {
      paths: [],
      modulesDirectories: [join(getPkgRoot(), 'node_modules')], // (default) only node_modules
      extensions: ['', '.js', '.jsx', '.ts', '.tsx'], // these extension
      fileSystem: fs,
      useSyncFileSystemCalls: true,
    };
  }

  if (resolver == null) {
    resolver = ResolverFactory.createResolver(opts);
  }

  try {
    return resolver.resolveSync({}, cwd, name);
  } catch (err) {
    console.log(`could not find file ${name}, in context: ${cwd}`);
  }

  return null;
});
