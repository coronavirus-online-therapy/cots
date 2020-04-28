#!/usr/bin/env node

const AWS = require('aws-sdk');
const idp = new AWS.CognitoIdentityServiceProvider();
const appsync = new AWS.AppSync();
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getPoolId(poolName) {
  return idp.listUserPools({MaxResults: 5}).promise().then(data => {
    return data.UserPools.filter(p => p.Name === poolName).map(p => p.Id)[0];
  });
}

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

async function deleteProvider(env, owner) {
  const providerTable = await getApiTable(`cots-${env}`, 'ProviderTable');
  console.log(`delete ${owner} from ${providerTable}`);
  return dynamodb.batchWrite({
    RequestItems: {
      [providerTable]: [
        {
          DeleteRequest: {
            Key: { owner}
          }
        }
      ]
    }
  }).promise();
}
async function deleteAccessPoints(env, owner) {
  const apTable = await getApiTable(`cots-${env}`, 'AccessPointTable');
  const resp = await dynamodb.query({
    TableName: apTable,
    KeyConditionExpression: '#owner = :owner',
    ExpressionAttributeNames: {
      '#owner': 'owner',
      '#state': 'state',
    },
    ExpressionAttributeValues: {
      ':owner': owner,
    },
    ProjectionExpression: '#state',
  }).promise();
  const deleteRequests = resp.Items.map((i => ({
      DeleteRequest: {
        Key: { 
          owner,
          state: i.state 
        }
      }
  })));
  if(deleteRequests.length > 0) {
    console.log(`delete ${owner} from ${apTable}`);
    return dynamodb.batchWrite({
      RequestItems: {
        [apTable]: deleteRequests,
      }
    }).promise();
  }
}

async function deleteUser(env, username) {
  const userPoolId = await getPoolId(`cots_userpool-${env}`);
  return idp.adminDeleteUser({
    UserPoolId: userPoolId,
    Username: username,
  }).promise();
}
async function getUser(env, email) {
  const userPoolId = await getPoolId(`cots_userpool-${env}`);
  return idp.listUsers({
    UserPoolId: userPoolId,
    AttributesToGet: ['sub', 'email', 'email_verified'],
    Filter: `email = "${email}"`
  }).promise().then(data => {
    return data.Users[0];
  });
}

async function main(email) {
  const env = 'production';
  const user = await getUser(env, email);

  if(user !== undefined) {
    await deleteAccessPoints(env, user.Username);
    await deleteProvider(env, user.Username);
    await deleteUser(env, user.Username);
  }

}

main(process.argv[2]);
