const jscodeshift = require('jscodeshift');
const parser = require('../parser/babylon');

const getDependencies = (source) => {
  const dependencies = [];

  const j = jscodeshift.withParser(parser);

  const root = j(source);
  root
    .find(j.ImportDeclaration)
    .forEach(p => {
      const name = p.value.source.value;
      dependencies.push(name);
    });

  root
    .find(j.CallExpression, {
      callee: {
        name: 'require'
      }
    })
    .forEach(p => {
      p.value.arguments.forEach(arg => {
        dependencies.push(arg.value);
      });
    });

  return dependencies;
};

module.exports = (fileNode) => {
  if (fileNode.ext !== '.js' && fileNode.ext !== '.jsx') {
    return [];
  }

  try {
    return getDependencies(fileNode.getSource());
  } catch (err) {
    return [];
  }
};