const lazyFn = (fn) => {
  let result;
  return (...args) => {
    if (result == null && fn instanceof Function) {
      result = fn(...args);
    }

    return result;
  };
};

module.exports = lazyFn;
