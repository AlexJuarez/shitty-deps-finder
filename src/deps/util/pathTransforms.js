const path = require('path');
const { getPkgRoot } = require('./getPkgRoot');

const expandMonorail = (name) => {
  if (name.indexOf(':monorail') > -1) {
    return name.replace(':monorail', path.join(getPkgRoot(), 'app/assets/javascripts'));
  }

  return name;
};

const expandProject = (name) => {
  if (name.startsWith(':')) {
    return name.replace(':', path.join(getPkgRoot(), 'frontend'));
  }

  return name;
};

const applyTransforms = (name, fns = [expandMonorail, expandProject]) => {
  let result = name;
  while (fns.length) {
    const fn = fns.shift();
    result = fn(result);
  }

  return result;
};

module.exports = applyTransforms;
