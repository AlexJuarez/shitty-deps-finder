const workerFarm = require("worker-farm");
const workers = require("./Worker");

class Manager {
  constructor(done) {
    this.jobs = [];
    this.started = 0;
    this.completed = 0;
    this.done = done;
  }

  add(path, cb) {
    this.jobs.push({ path, cb });
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

    const { path, cb } = this.jobs.shift();
    workers({ path }, (err, { source, dependencies }) => {
      if (err) {
        console.error(err);
      }

      this.completed++;

      cb({ source, dependencies });

      if (this.completed > 0 && this.completed === this.started && !this.jobs.length) {
        this.done();
      }
    });
  }
}

module.exports = Manager;
