const profiles = {};

function getStack() {
  return (new Error).stack.split(/\s+/g).slice(2).reverse().slice(2);
}

function profileFn(fn, name) {
  const stack = getStack();
  const key = name || stack.join('');

  if (profiles[key] == null) {
    profiles[key] = { time: 0, stack };
  }

  return (...args) => {
    const start = new Date();
    const result = fn(...args);
    profiles[key].time += (new Date() - start);
    return result;
  };
}

const sp = new Date();

function getProfiles() {
  console.log(`time elapsed: ${new Date() - sp}ms`);
  return profiles;
}

module.exports.profileFn = profileFn;
module.exports.getProfiles = getProfiles;
