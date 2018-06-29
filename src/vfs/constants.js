exports.GLOB_OPTS = {
  absolute: true,
  onlyFiles: true,
  dot: true,
  stats: true,
  transform: (entry) => typeof entry === 'string' ? { path: entry } : { path: entry.path },
};
