const { join } = require('path');
const builtinModules = require('builtin-modules');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');

function isAbsolute(name) {
  return name.indexOf('/') === 0;
}

function isBuiltIn(name) {
  return builtinModules.indexOf(name) !== -1;
}

function isProjectRoot(name) {
  return name.startsWith(':');
}

function isExternalPath(name, path) {
  return !path || path.indexOf(join('node_modules', name)) > -1;
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
  [isProjectRoot, 'project'],
  [isInternalModule, 'internal'],
  [isRelativeToParent, 'parent'],
  [isIndex, 'index'],
  [isRelativeToSibling, 'sibling']
];

function type(name, path) {
  for (let i = 0; i < rules.length; i++) {
    const [rule, type] = rules[i];
    if(rule(name, path)) {
      return type;
    }
  }

  return 'unknown';
};

module.exports = (cwd) => {
  const opts = {
    paths: [],
    modulesDirectories: [join(cwd, 'node_modules')], // (default) only node_modules
    extensions: ['', '.node', '.js', '.jsx', '.es6.js', '.json'], // these extension
    fileSystem: require('fs'),
    useSyncFileSystemCalls: true
  };
  const resolver = ResolverFactory.createResolver(opts);
  function resolve(name) {
    try {
      return resolver.resolveSync({}, cwd, name);
    } catch (err) {
      console.log(`could not find file ${name}, in context: ${cwd}`);
    }

    return null;
  }

  return {
    resolve,
    isAbsolute,
    type
  };
}
