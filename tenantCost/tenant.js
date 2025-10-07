// middleware/tenantCost.js
import { performance } from "perf_hooks";
import { v4 as uuidv4 } from "uuid";
import dogstatsd from "../metrics.js";
import logger from "../loggger.js";

export function tenantCostMiddleware({ sampleRate = 1.0, enabled = true } = {}) {
  if (!enabled) return (req, res, next) => next();

  return (req, res, next) => {
    if (Math.random() > sampleRate) return next();

    const tenantId = req.headers["x-tenant-id"] || "jaa";
    if (!tenantId) return res.status(400).json({ error: "Tenant ID missing" });

    const requestId = uuidv4();
    const startTime = performance.now();
    const startMem = process.memoryUsage().heapUsed;

    req.tenantCost = { tenantId, requestId };

    res.on("finish", () => {
      try {
        const durationMs = performance.now() - startTime;
        const memUsed = Math.max(0, process.memoryUsage().heapUsed - startMem);

        const tags = [
          `tenant:${tenantId}`,
          `status_code:${res.statusCode}`,
          `method:${req.method}`,
          `path:${req.path}`,
          `request_id:${requestId}`,
        ];

        dogstatsd.timing("request.duration", durationMs, tags);
        dogstatsd.gauge("request.memory_usage", memUsed, tags);
        dogstatsd.increment("request.count", 1, tags);

        if (durationMs > 1000) {
          logger.warn({
            msg: "Slow request detected",
            tenantId,
            requestId,
            durationMs: Math.round(durationMs),
            statusCode: res.statusCode,
            path: req.path,
            method: req.method,
          });
        }
      } catch (error) {
        logger.error({
          msg: "Tenant cost middleware error",
          error: error.message,
          stack: error.stack,
        });
      }
    });

    res.on("close", () => {
      dogstatsd.increment("request.client_disconnect", 1, [
        `tenant:${tenantId}`,
        `request_id:${requestId}`,
      ]);
    });

    next();
  };
}
