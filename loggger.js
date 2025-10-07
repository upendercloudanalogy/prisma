// logger.js
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: null,
});

export default logger;
