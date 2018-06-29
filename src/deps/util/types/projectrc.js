const path = require('path');
const fs = require('fs');
const RJSON = require('relaxed-json');

const readProjectConfig = (dir) => {
  const file = ['.projectrc', 'project.json5']
    .map(f => path.join(dir,f))
    .filter(fs.existsSync)
    .shift();

  try {
    return file != null && RJSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
  } catch (err) {
    return {};
  }
};

const getProjectMainPath = (name) => {
  const config = readProjectConfig(name);

  if (config.main != null) {
    return path.join(name, config.main);
  }

  return false;
};

module.exports = getProjectMainPath;
