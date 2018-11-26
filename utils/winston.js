const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf } = format;
const config = require('../config.json');

var environment = process.env.NODE_ENV || config.NODE_ENV || 'development';

// define the custom settings for each transport (file, console)
var options = {
  file: {
    filename: 'logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  }
};

const logFormat = printf( (logentry) => {
    return `${logentry.timestamp} [${logentry.label}] ${logentry.level}: ${logentry.message}`;
});

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
 level: (environment === 'production') ? config.winstonprodloglevel : 'info',
  format: combine(
    label({ label: 'myApp: '}),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss A ZZZ'}),
    logFormat
  ),
  transports: [
    new transports.File(options.file)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;