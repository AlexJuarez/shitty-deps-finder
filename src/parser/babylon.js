const babylon = require('babylon');

const options = {
  plugins: [
    'esgraph', 'jsx', 'objectRestSpread'
  ],
  sourceType: 'module',
};

/**
 * Wrapper to set default options
 */
exports.parse = code => babylon.parse(code, options);
