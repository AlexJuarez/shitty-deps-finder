const walk = require('babylon-walk');

const parser = require('../parser/babylon');
const { profileFn } = require('../util/profileFn');

const isStringLiteral = (node) => 
  node.type === 'Literal' || node.type === 'StringLiteral';

const getImports = (ast) => {
  const state = {
    dependencies: [],
  };

  const visitors = {
    ImportDeclaration(node, state) {
      state.dependencies.push(node.source.value);
    }
  };

  walk.simple(ast, visitors, state);

  return state.dependencies;
}

const getRequire = (ast) => {
  const state = {
    dependencies: [],
  };

  const fns = ['require', 'lazyLoad', 'dynamicImport'];

  const visitors = {
    CallExpression(node, state) {
      if (node.callee.type !== 'Identifier') {
        return;
      }

      if (fns.indexOf(node.callee.name) > -1) {
        const dependencies = node.arguments.filter(isStringLiteral).map(a => a.value);
        state.dependencies.push(...dependencies);
      }
    }
  };

  walk.simple(ast, visitors, state);

  return state.dependencies;
}

const getDependencies = (source) => {
  const ast = parser.parse(source);

  return [
    ...getImports(ast),
    ...getRequire(ast),
  ];
};

module.exports = profileFn((source) => {
  try {
    return getDependencies(source);
  } catch (err) {
    return [];
  }
}, 'getDependencies');