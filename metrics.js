// metrics.js
import { StatsD } from "hot-shots";
import logger from "./loggger.js";

// DogStatsD client
const dogstatsd = new StatsD({
  host: process.env.DD_AGENT_HOST || "127.0.0.1",
  port: Number(process.env.DD_DOGSTATSD_PORT) || 8125,
  prefix: process.env.DD_METRIC_PREFIX || "tenant.",
  globalTags: process.env.DD_GLOBAL_TAGS
    ? process.env.DD_GLOBAL_TAGS.split(",")
    : [],
  errorHandler: (err) => {
    logger.error({
      msg: "DogStatsD error",
      error: err.message,
      stack: err.stack,
    });
  },
});

export default dogstatsd;
