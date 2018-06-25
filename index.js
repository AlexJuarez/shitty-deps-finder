const DependencyGraph = require('./src/deps/DependencyGraph');
const VFS = require('./src/vfs');
const { getPkgRoot, setPkgRoot } = require('./src/deps/util/getPkgRoot');
const path = require('path');
const { getProfiles } = require('./src/deps/util/profileFn');

setPkgRoot(path.resolve('../airbnb/'));

const deps = new DependencyGraph();
deps.hydrate();

const patterns = [
  'app/assets/javascripts/**/*.{js,jsx,ts,tsx}',
  'spec/javascripts/**/*.{js,jsx,ts,tsx}',
  'frontend/**/*.{js,jsx,ts,tsx}',
];

VFS.async(patterns, { cwd: getPkgRoot(), cacheFile: '/tmp/.changes.cache.json' }).then((files) => {
  files.forEach(file => deps.addPath(file.path));
  deps.dump();
  console.log(`found ${files.length} files`);
  console.log(deps.toGraph());
  getProfiles();
});
