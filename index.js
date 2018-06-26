const DependencyGraph = require('./src/deps/DependencyGraph');
const VFS = require('./src/vfs');
const { getPkgRoot, setPkgRoot } = require('./src/deps/util/getPkgRoot');
const path = require('path');
const { getProfiles } = require('./src/deps/util/profileFn');

setPkgRoot(path.resolve('../airbnb/'));

const deps = new DependencyGraph();
deps.hydrate();

const patterns = [
  'app/assets/javascripts/**/*.{test,js,jsx,ts,tsx}',
  'spec/javascripts/**/*.{test,js,jsx,ts,tsx}',
  'frontend/**/*.{test,js,jsx,ts,tsx}',
];

VFS.async(patterns, { cwd: getPkgRoot(), cacheFile: '/tmp/.changes.cache.json' }).then((files) => {
  files.forEach(file => deps.addPath(file.path));
  [...deps.toArray()].filter((file) => file.name.indexOf('PhotoMosaic') !== -1).forEach(p => {
    console.log(p);
  });
  deps.dump();
  console.log(`found ${files.length} files`);
  getProfiles();
});
