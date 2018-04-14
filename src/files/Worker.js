const getSource = require('./getSource');
const getDependencies = require('./getDependencies');

function Worker({ path }, callback) {
  getSource(path).then((source) => {
    getDependencies(source).then((dependencies) => {
      callback(null, { source, dependencies });
    });
  });
}

module.exports = Worker;