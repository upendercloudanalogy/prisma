// test-metrics.js
import dogstatsd from './metrics.js';
import logger from './loggger.js';

logger.info({
  msg: 'Test metric (as log) sent',
  metric: 'test.metric',
  value: 1
});
console.log('✅ Test metric sent. Check Datadog UI in a minute.');
