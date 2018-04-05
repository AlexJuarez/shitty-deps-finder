// log levels
exports.LOG_DISABLE = 'OFF';
exports.LOG_ERROR = 'ERROR';
exports.LOG_WARN = 'WARN';
exports.LOG_INFO = 'INFO';
exports.LOG_DEBUG = 'DEBUG';

exports.COLOR_PATTERN = '%[%d{DATE}:%p [%c]: %]%m';
exports.NO_COLOR_PATTERN = '%d{DATE}:%p [%c]: %m';

// Default console appender
exports.CONSOLE_APPENDER = {
  type: 'console',
  layout: {
    type: 'pattern',
    pattern: exports.COLOR_PATTERN
  }
};
