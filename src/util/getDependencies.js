const walk = require('babylon-walk');

const parser = require('../parser/babylon');
const { profileFn } = require('../util/profileFn');

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

  const visitors = {
    CallExpression(node, state) {
      if (node.callee.name === 'require') {
        state.dependencies.push(...node.arguments.map(a => a.value));
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