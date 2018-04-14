const workerFarm = require("worker-farm");
const workers = require("./Worker");

const keyFn = (cwd, name) => `${cwd}/${name}`;

class Manager {
  constructor(root, done) {
    this.jobs = [];
    this.visited = {};
    this.started = 0;
    this.completed = 0;
    this.done = done;
    this.root = root;
  }

  add({ cwd, name }, cb) {
    const key = keyFn(cwd, name);
    if (this.visited[key] != null) {
      return;
    }

    this.visited[key] = true;
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

      if (this.completed > 0 && this.completed === this.started && !this.jobs.length) {
        this.done();
      }

      if (results != null) {
        cb(results);
      }

      this.execute();
    });
  }
}

module.exports = Manager;
