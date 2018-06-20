class Log {
  static warn(...args) {
    console.warn(...args);
  }

  static log(...args) {
    console.log(...args);
  }

  static error(...args) {
    console.error(...args);
  }

  static debug(...args) {
    // console.debug(...args);
  }

  static info(...args) {
    console.info(...args);
  }
}

module.exports = Log;
