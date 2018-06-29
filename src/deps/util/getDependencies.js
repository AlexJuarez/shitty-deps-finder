const walk = require('babylon-walk');
const t = require('babel-types');
const parser = require('../parser');
const { profileFn } = require('./profileFn');
const path = require('path');
const { getPkgRoot } = require('../util/getPkgRoot');
const Path = require('../store/Path');

const fns = ['require', 'lazyLoad', 'dynamicImport', 'importWithMock'];

const addRequires = (node, state) => {
  if(!t.isIdentifier(node.callee)) return;
  if(fns.indexOf(node.callee.name) === -1) return;
  if(node.arguments.length > 1) return;
  if(!t.isStringLiteral(node.arguments[0])) return;

  state.dependencies.push(node.arguments[0].value);
};

// this is a helper for paths imported with
// context switched to the parentPath
const addMocks = (node, parentPath, state) => {
  if (!t.isObjectExpression(node)) return;

  node.properties.forEach(prop => {
    if (!t.isStringLiteral(prop.key)) return;

    const path = Path.normalize(parentPath, prop.key.value);
    state.dependencies.push(path);
  });
};

const addImportPathFromDirMock = (node, state) => {
  if (!t.isIdentifier(node.callee)) return;
  if (node.callee.name !== 'importPathFromDirWithMock') return;
  if (!t.isStringLiteral(node.arguments[0])) return;
  if (!t.isStringLiteral(node.arguments[1])) return;

  const fullPath = path.join(
    getPkgRoot(),
    node.arguments[0].value,
    node.arguments[1].value
  );

  state.dependencies.push(fullPath);

  addMocks(node.arguments[2], path.dirname(fullPath), state);
};

const getDependencies = (filePath, source) => {
  const ast = parser.parse(filePath, source);

  const state = {
    dependencies: [],
  };

  const visitors = {
    CallExpression(node, state) {
      addRequires(node, state);
      addImportPathFromDirMock(node, state);
    },

    ImportDeclaration(node, state) {
      state.dependencies.push(node.source.value);
    }
  };

  walk.simple(ast, visitors, state);

  return state.dependencies;
};

module.exports = profileFn((filePath, source) => {
  try {
    return getDependencies(filePath, source);
  } catch (err) {
    console.log(`error parsing ${filePath}`);
    console.log(err.message);
    return [];
  }
}, 'getDependencies');
