const { join } = require('path');
const builtinModules = require('builtin-modules');

function isAbsolute(name) {
  return name.indexOf('/') === 0;
}

function isBuiltIn(name) {
  return builtinModules.indexOf(name) !== -1;
}

function isProjectRoot(name) {
  return name.startsWith(':');
}

function isExternalPath(name, cwd) {
  return !cwd || cwd.indexOf(join('node_modules', name)) > -1;
}

const externalModuleRegExp = /^\w/;
function isExternalModule(name, cwd) {
  return externalModuleRegExp.test(name) && isExternalPath(name, cwd);
}

const scopedRegExp = /^@\w+\/\w+/;
function isScoped(name) {
  return scopedRegExp.test(name);
}

function isInternalModule(name, cwd) {
  return externalModuleRegExp.test(name) && !isExternalPath(name, cwd);
}

function isRelativeToParent(name) {
  return name.indexOf('../') === 0;
}

const indexFiles = ['.', './', './index', './index.js'];
function isIndex(name) {
  return indexFiles.indexOf(name) !== -1;
}

function isRelativeToSibling(name) {
  return name.indexOf('./') === 0;
}

const rules = [
  [isBuiltIn, 'builtin'],
  [isExternalModule, 'external'],
  [isScoped, 'external'],
  [isProjectRoot, 'project'],
  [isInternalModule, 'internal'],
  [isRelativeToParent, 'parent'],
  [isIndex, 'index'],
  [isRelativeToSibling, 'sibling']
];

const types = rules.map(rule => rule[1]);

function type(name, cwd) {
  for (let i = 0; i < rules.length; i++) {
    const [rule, type] = rules[i];
    if(rule(name, cwd)) {
      return type;
    }
  }

  return 'unknown';
};

module.exports = {
  type,
  types,
  isAbsolute,
  isBuiltIn,
  isProjectRoot,
  isExternalPath,
  isExternalModule,
  isScoped,
  isInternalModule,
  isRelativeToParent,
  isIndex,
  isRelativeToSibling
};
