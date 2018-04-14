const workerFarm = require("worker-farm");
const workers = require("./Worker");
const { getProfiles } = require('../util/profileFn');

class Manager {
  constructor(root, done) {
    this.jobs = [];
    this.done = done;
    this.root = root;
    this.completed = 0;
    this.started = 0;
  }

  add({ cwd, name }, cb) {
    this.jobs.push({ name, cwd, cb });
    this.started++;
    this.execute();
  }

  list() {
    return this.jobs;
  }

  execute() {
    if (!this.jobs.length) {
      return;
    }

    const { name, cwd, cb } = this.jobs.shift();
    const { root } = this;
    workers({ name, cwd, root }, (err, results) => {
      if (err) {
        console.error(err);
      }

      this.completed++;

      if (
        this.completed > 1 &&
        this.completed === this.started &&
        !this.jobs.length
      ) {
        console.log(getProfiles());
        return;
      }

      if (results != null) {
        cb(results);
      }

      this.execute();
    });
  }
}

module.exports = Manager;
