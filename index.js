const DependencyGraph = require('./src/deps/DependencyGraph');
const VFS = require('./src/vfs');
const { getPkgRoot, setPkgRoot } = require('./src/deps/util/getPkgRoot');
const path = require('path');
const { getProfiles, profileFn } = require('./src/deps/util/profileFn');

setPkgRoot(path.resolve('../airbnb/'));

const deps = new DependencyGraph();
deps.hydrate();

const patterns = [
  'app/assets/javascripts/**/*.{test,js,jsx,ts,tsx}',
  'spec/javascripts/**/*.{test,js,jsx,ts,tsx}',
  'frontend/**/*.{test,js,jsx,ts,tsx}',
];

const filePath = '/Users/ajuarez/projects/airbnb/frontend/luxury-guest/src/components/old-dls/Pdp/sections/PhotoMosaicSection.jsx';

VFS.async(patterns, { cwd: getPkgRoot() }).then((files) => {
  files.forEach(file => {
    deps.addPath(file.path)
  });

  const graph = deps.toGraph();

  console.log(graph[filePath]);
  deps.dump();
  console.log(`found ${files.length} files`);
  getProfiles();
});
