// costAllocator.js
import { getTenantUsage } from "./datadogUsage.js";

// Dummy VM cost, replace with Azure API call
export async function getVmCost(resourceId) {
  return 100; // example cost
}

export async function allocateCost(resourceId) {
  const vmCost = await getVmCost(resourceId);
  const now = Math.floor(Date.now() / 1000);
  const monthAgo = now - 30 * 24 * 3600;

  const usage = await getTenantUsage("request.count", monthAgo, now);
  const totalUsage = usage.reduce((sum, u) => sum + u.value, 0);

  if (totalUsage === 0) return usage.map(u => ({ ...u, share: 0, allocatedCost: 0 }));

  return usage.map(u => ({
    tenant: u.tenant,
    usage: u.value,
    share: u.value / totalUsage,
    allocatedCost: (u.value / totalUsage) * vmCost,
  }));
}
