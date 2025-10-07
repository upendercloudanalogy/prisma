// // datadogUsage.js
// import datadog from '@datadog/datadog-api-client';

// const configuration = datadog.client.createConfiguration({
//   authMethods: {
//     apiKeyAuth: "f5f7738aba0961effa2ff46beaafb71f",
//     appKeyAuth:"f41226c0ae0594e3d517e7c94caae986fdc68cc2"
//   }
// });

// const metricsApi = new datadog.v1.MetricsApi(configuration);

// export async function getTenantUsage(metric, from, to) {
//   try {
//     const resp = await metricsApi.queryMetrics({
//       from,
//       to,
//       query: `${metric}{*}by{tenant}`,
//     });

//     const series = resp.series || [];
//     return series.map(s => ({
//       tenant: s.scope.split(":")[1],
//       value: s.pointlist.reduce((sum, p) => sum + (p[1] || 0), 0),
//     }));
//   } catch (error) {
//     console.error('Error details:', error.message);
//     console.error('Error code:', error.code);
    
//     // If it's still 401, you'll need an app key
//     if (error.code === 401) {
//       console.error('This endpoint requires both API key and App key');
//       console.error('Please create an App key in Datadog:');
//       console.error('Organization Settings → Application Keys');
//     }
//     throw error;
//   }
// }


// // datadogUsage.js
// import * as datadog from '@datadog/datadog-api-client';

// const configuration = datadog.client.createConfiguration({
//   authMethods: {
//     apiKeyAuth: process.env.DD_API_KEY,
//     appKeyAuth: process.env.DD_APP_KEY ,
//  },
//   baseServer: {
//     url: 'https://api.us5.datadoghq.com', // <-- your actual region
//   },
// });

// const metricsApi = new datadog.v1.MetricsApi(configuration);

// export async function getTenantUsage(metric, from, to) {
//   try {
//     const resp = await metricsApi.queryMetrics({
//       from,
//       to,
//       query: `${metric}{*}by{tenant}`,
//     });

//     const series = resp.series || [];
//     return series.map(s => ({
//       tenant: s.scope?.split(":")[1] || "unknown",
//       value: s.pointlist.reduce((sum, p) => sum + (p[1] || 0), 0),
//     }));
//   } catch (error) {
//     console.error('Datadog query error:', error.message, error.code);
//     if (error.code === 401) {
//       console.error('Requires valid API + App keys in environment variables.');
//     }
//     throw error;
//   }
// }

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
  const apiKey = process.env.DD_API_KEY;
  const appKey = process.env.DD_APP_KEY;


export async function getTenantUsage(metric, from, to) {

  const url = `https://api.us5.datadoghq.com/api/v1/query?from=${from}&to=${to}&query=${encodeURIComponent("avg:tenant.request.memory_usage{*} by {tenant}")}`;

  console.log(apiKey,'apii');
  console.log(appKey,'app');
  
  console.log(metric);
  
  const res = await fetch(url, {
    headers: {
      "DD-API-KEY": apiKey,
      "DD-APPLICATION-KEY": appKey
    }
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Datadog query failed: ${res.status} ${body}`);
  }

  const data = await res.json();
  return (data.series || []).map(s => ({
    tenant: s.scope?.split(":")[1] || "unknown",
    value: s.pointlist.reduce((sum, p) => sum + (p[1] || 0), 0),
  }));
}
