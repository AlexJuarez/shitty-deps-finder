const workerFarm = require("worker-farm");
const workers = require("./Worker");

class Manager {
  constructor(root, done) {
    this.jobs = [];
    this.started = 0;
    this.completed = 0;
    this.done = done;
    this.root = root;
  }

  add({ name, cwd }, cb) {
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

      cb(results);

      if (this.completed > 0 && this.completed === this.started && !this.jobs.length) {
        this.done();
      }
    });
  }
}

module.exports = Manager;
