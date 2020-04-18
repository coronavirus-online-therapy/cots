#!/usr/bin/env node

const AWS = require('aws-sdk');
const appsync = new AWS.AppSync();
const dynamodb = new AWS.DynamoDB.DocumentClient();


async function getApiId(apiName) {
  return appsync.listGraphqlApis().promise().then(data => {
    return data.graphqlApis.filter(a => a.name === apiName).map(a => a.apiId)[0];
  });
}

async function getApiTable(apiName, tableName) {
  const apiId = await getApiId(apiName);
  return appsync.listDataSources({apiId}).promise().then(data => {
    return data.dataSources.filter(ds => ds.name === tableName).map(ds => ds.dynamodbConfig.tableName)[0];
  });
}

async function getProviders(env, attrs) {
  const providerTable = await getApiTable(`cots-${env}`, 'ProviderTable');
  const resp = await dynamodb.scan({TableName: providerTable, AttributesToGet: attrs}).promise();
  return resp.Items.reduce((providers, provider) => {
    providers[provider.owner] = provider;
    return providers;
  }, {});
}
async function getAccessPoints(env, attrs) {
  const providerTable = await getApiTable(`cots-${env}`, 'AccessPointTable');
  const resp = await dynamodb.scan({TableName: providerTable, AttributesToGet: attrs}).promise();
  return resp.Items;
}

async function main() {
  const env = 'production';
  const providers = await getProviders(env, ['owner', 'rate']);
  const accessPoints = await getAccessPoints(env, ['owner', 'state']);

  const statsByState = accessPoints.reduce((stats, ap) => {
    if(stats[ap.state] === undefined) {
      stats[ap.state] = {
        count: 0,
        rate: 0,
      }
    }
    const stat = stats[ap.state];
    stat.rate = ((stat.rate*stat.count)+providers[ap.owner].rate) / (stat.count+1);
    stat.count = stat.count + 1;

    return stats;
  },{});

  Object.entries(statsByState)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([k,v]) => `${k},${v.rate},${v.count}`)
        .forEach(r => console.log(r));
}

main();
