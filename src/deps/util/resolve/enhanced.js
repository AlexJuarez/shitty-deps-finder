const fs = require('fs');
const { join } = require('path');

const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');

const { getPkgRoot } = require('../getPkgRoot');

let resolver;
// lazily create the resolver (getPkgRoot)
const getResolver = () => {
  if (resolver == null) {
    resolver = ResolverFactory.createResolver({
      paths: [],
      modulesDirectories: [join(getPkgRoot(), 'node_modules')], // (default) only node_modules
      extensions: ['', '.js', '.jsx', '.ts', '.tsx'], // these extension
      fileSystem: fs,
      useSyncFileSystemCalls: true,
    });
  }

  return resolver;
};

module.exports = (cwd, name) => {
  try {
    return getResolver().resolveSync({}, cwd, name);
  } catch (err) {
    console.log(`could not find file ${name}, in context: ${cwd}`);
  }

  return null;
};
