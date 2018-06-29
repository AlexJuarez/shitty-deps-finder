const walk = require('babylon-walk');
const t = require('babel-types');
const parser = require('../parser');
const { profileFn } = require('./profileFn');

const fns = ['require', 'lazyLoad', 'dynamicImport', 'importWithMock'];

const addRequires = (node, state) => {
  if(!t.isIdentifier(node.callee)) return;
  if(fns.indexOf(node.callee.name) === -1) return;
  if(node.arguments.length > 1) return;
  if(!t.isStringLiteral(node.arguments[0])) return;

  state.dependencies.push(node.arguments[0].value);
};

const getDependencies = (filePath, source) => {
  const ast = parser.parse(filePath, source);

  const state = {
    dependencies: [],
  };

  const visitors = {
    CallExpression(node, state) {
      addRequires(node, state);
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
    return [];
  }
}, 'getDependencies');
