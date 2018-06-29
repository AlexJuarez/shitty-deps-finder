const path = require('path');
const fs = require('fs');
const { getPkgRoot } = require('./getPkgRoot');
const memoize = require('./memoize');
const RJSON = require('relaxed-json');

const readProjectConfig = memoize((dir) => {
  const file = ['.projectrc', 'project.json5'].map(f => path.join(dir,f)).filter(fs.existsSync).shift();
  try {
    return file != null && RJSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
  } catch (err) {
    return {};
  }
});

const getProjectMainPath = (name) => {
  const dir = path.join(getPkgRoot(), 'frontend', name.replace(':', ''));
  if (name.indexOf('/') === -1) {
    const config = readProjectConfig(dir);
    const { main } = config;
    return main != null ? path.join(dir, main) : dir;
  }

  return dir;
};

const expandMonorail = (name) => {
  if (name.indexOf(':monorail') > -1) {
    return name.replace(':monorail', path.join(getPkgRoot(), 'app/assets/javascripts'));
  }

  return name;
};

const expandProject = (name) => {
  if (name.startsWith(':')) {
    return getProjectMainPath(name);
  }

  return name;
};

module.exports = {
  expandMonorail,
  expandProject,
};
