module.exports = (keyFn, fn) => {
  const cache = {};
  
  return (...args) => {
    const key = keyFn(...args);

    if (cache[key] == null) {
      cache[key] = fn(...args);
    }

    return cache[key];
  };
};
