module.exports = (fn, keyFn) => {
  const cache = {};

  if (keyFn == null) {
    keyFn = (...args) => [...args].map(arg => arg.toString()).join(':');
  }

  return (...args) => {
    const key = keyFn(...args);

    if (cache[key] == null) {
      cache[key] = fn(...args);
    }

    return cache[key];
  };
};
