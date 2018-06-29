const parser = require('@babel/parser');
const { extname } = require('path');

/**
 * Wrapper to set default options
 */
exports.parse = (filePath, code) => {
  const plugins = ['esgraph', 'jsx', 'objectRestSpread'];

  if (extname(filePath).match(/tsx?/)) {
    plugins.push(...['classProperties', 'typescript']);
  }

  return parser.parse(code, { plugins, sourceType: 'module' });
};
