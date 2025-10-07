

// const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

export async function getVmCost(resourceId) {
//   const credential = new DefaultAzureCredential();
//   const client = new ConsumptionManagementClient(credential, subscriptionId);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

 let totalCost = 100;

  return totalCost;
}
