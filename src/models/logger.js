const winston = require('winston');

// Define log levels with the corresponding colors
const logLevels = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue'
};


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            filename: 'app.log',
            level: 'info'
        })
    ]
});

// Add console transport for logging to console
// logger.add(new winston.transports.Console({
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//     )
//}));

module.exports = logger;
