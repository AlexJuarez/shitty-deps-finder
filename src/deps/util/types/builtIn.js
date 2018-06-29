const builtinModules = require('builtin-modules');

const isBuiltIn = (name) => builtinModules.indexOf(name) !== -1;

module.exports = isBuiltIn;
