const profiles = {};

function profileFn(fn, key) {
  if (profiles[key] == null) {
    profiles[key] = { time: 0 };
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
