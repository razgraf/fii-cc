const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint } = format;

const customLogger = createLogger({
  format: combine(timestamp(), format.json()),
  transports: [
    // new transports.Console(),
    new transports.File({ filename: "analysis.log" })
  ]
});

module.exports.logger = {
  log: (message, data = {}) => {
    const { level, extra } = data;

    return extra === null
      ? customLogger.log({ level: level || "info", message })
      : customLogger.log({ label: extra, level: level || "info", message });
  }
};
