const fs = require('fs');

function getSource(path) {
  return fs.readFileSync(path, { encoding: 'utf8' });
}

module.exports = getSource;
