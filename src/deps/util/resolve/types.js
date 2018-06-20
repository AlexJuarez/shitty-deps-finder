const { join } = require('path');
const builtinModules = require('builtin-modules');

function isAbsolute(name) {
  return name.startsWith('/');
}

function isBuiltIn(name) {
  return builtinModules.indexOf(name) !== -1;
}

function isExternalPath(name, path) {
  return !path || path.indexOf('node_modules') !== -1;
}

const externalModuleRegExp = /^\w/;
function isExternalModule(name, path) {
  return externalModuleRegExp.test(name) && isExternalPath(name, path);
}

const scopedRegExp = /^@\w+\/\w+/;
function isScoped(name) {
  return scopedRegExp.test(name);
}

function isInternalModule(name, path) {
  return externalModuleRegExp.test(name) && !isExternalPath(name, path);
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
  [isInternalModule, 'internal'],
  [isRelativeToParent, 'parent'],
  [isIndex, 'index'],
  [isRelativeToSibling, 'sibling'],
  [isAbsolute, 'absolute'],
];

const types = rules.map(rule => rule[1]);

function type(name, path) {
  for (let i = 0; i < rules.length; i++) {
    const [rule, type] = rules[i];
    if(rule(name, path)) {
      return type;
    }
  }

  return 'unknown';
};

module.exports = {
  type,
  types,
  isBuiltIn,
  isExternalModule,
  isScoped,
  isInternalModule,
  isRelativeToParent,
  isIndex,
  isRelativeToSibling
};