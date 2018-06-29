const fs = require('graceful-fs');

function getSource(path) {
  try {
    return fs.readFileSync(path, { encoding: 'utf8' });
  } catch (err) {
    console.log(`could not read ${path}`);
  }
}

module.exports = getSource;
