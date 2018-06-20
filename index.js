const DependencyGraph = require('./src/deps/DependencyGraph');
const VFS = require('./src/vfs');
const { getPkgRoot, setPkgRoot } = require('./src/deps/util/getPkgRoot');
const path = require('path');

setPkgRoot(path.resolve('../airbnb/'));

const deps = new DependencyGraph();

const patterns = [
  'app/assets/javascripts/**/*.{js,jsx,ts,tsx}',
  'spec/javascripts/**/*.{js,jsx,ts,tsx}',
  'frontend/**/*.{js,jsx,ts,tsx}',
];

VFS.async(patterns, { cwd: getPkgRoot() }).then((files) => {
  files.forEach(file => deps.addPath(file.path));
  console.log(`found ${files.length} files`);
  console.log(deps.toGraph());
});
