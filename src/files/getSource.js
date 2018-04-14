const fs = require('fs');

function getSource(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf8' }, (err, source) => {
      if (err) {
        reject(err);
      }

      resolve(source);
    });
  });
}

module.exports = getSource;
