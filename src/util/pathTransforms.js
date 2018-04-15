const path = require('path');
const fs = require('fs');
const resolver = require('./resolve-imports');
const getPkgRoot = require('./getPkgRoot');

const readProjectConfig = (dir) => {
  const file = ['.projectrc', 'project.json5'].map(f => path.join(dir,f)).filter(fs.existsSync).shift();
  try {
    return file != null && JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
  } catch (err) {
    return {};
  }
}

const getProjectMainPath = (name) => {
  const dir = path.resolve(getPkgRoot(), 'frontend', name.replace(':', ''));
  const config = readProjectConfig(dir);
  const { main } = config;
  return main != null ? path.join(dir, main) : dir;  
};

const expandMonorail = (name) => {
  if (name.indexOf(':monorail') > -1) {
    return name.replace(':monorail', path.resolve(root, 'app/assets/javascripts'));
  }

  return name;
}

const expandProject = (name) => {
  if (resolver().type(name) === 'project') {
    return getProjectMainPath(name);
  }

  return name;
}

module.exports = {
  expandMonorail,
  expandProject,
};
