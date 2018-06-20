const fs = require('fs');

function getSource(path) {
  if (path == null || !fs.existsSync(path)) {
    return;
  }

  try {
    return fs.readFileSync(path, { encoding: 'utf8' });
  } catch (err) {
    console.log(`could not read ${path}`);
  }
}

module.exports = getSource;
