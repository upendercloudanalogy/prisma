import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
dotenv.config();

import { allocateCost } from './costAllocator.js';
import { tenantCostMiddleware } from './tenantCost/tenant.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(tenantCostMiddleware());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const resourceId = "/subscriptions/<subId>/resourceGroups/<rg>/providers/Microsoft.Compute/virtualMachines/<vmName>";

allocateCost(resourceId).then(report => {
  console.table(report);
});
app.use(routes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}
);