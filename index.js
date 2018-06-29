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

const createTestPath = (fp) =>
  path.join(getPkgRoot(), fp);

const testPath1 = createTestPath('/frontend/luxury-guest/src/components/old-dls/Pdp/sections/PhotoMosaicSection.jsx');
const testPath2 = createTestPath('/app/assets/javascripts/shared/experiences/utils/bootstrapDataUtils.js');

const testPath = (path, graph) => {
  console.log(`file: ${path}`);
  console.log(`is referred by:`);
  console.log([...graph[path]]);
};

VFS.async(patterns, { cwd: getPkgRoot(), exclude: ['**/vendor/**'] }).then((files) => {
  files.forEach(file => {
    deps.addPath(file.path)
  });

  const graph = deps.toGraph();
  testPath(testPath1, graph);
  testPath(testPath2, graph);
  deps.dump();
  console.log(`found ${files.length} files`);
  getProfiles();
});
