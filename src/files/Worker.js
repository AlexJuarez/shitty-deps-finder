const getSource = require('./getSource');
const getDependencies = require('./getDependencies');
const PathResolver = require('./PathResolver');

const thunk = (...fns) => {
  const fn = fns.shift();
  return (...args) => {
    const output = fn(...args);

    if (fns.length > 0) {
      return output.then(r => thunk(...fns)(r));
    }
 
    return output;
  }
}

function Worker({ name, cwd, root }, callback) {
  const pathFactory = new PathResolver();
  const pathNode = pathFactory.createPathNode(name, cwd, root);
  const { path } = pathNode;

  if (path == null) {
    return callback(null);
  }

  thunk(getSource, getDependencies, (dependencies) => {
    callback(null, { name, cwd, path, dependencies });
  })(path);
}

module.exports = Worker;