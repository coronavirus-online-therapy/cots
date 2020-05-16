#!/usr/bin/env node

const AWS = require('aws-sdk');
const idp = new AWS.CognitoIdentityServiceProvider();

async function getPoolId(poolName) {
  return idp.listUserPools({MaxResults: 5}).promise().then(data => {
    return data.UserPools.filter(p => p.Name === poolName).map(p => p.Id)[0];
  });
}

async function addUserToGroup(env, username, group) {
  const userPoolId = await getPoolId(`cots_userpool-${env}`);
  return idp.adminAddUserToGroup({
    UserPoolId: userPoolId,
    Username: username,
    GroupName: group,
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
    await addUserToGroup(env, user.Username, 'admin');
  }

}

main(process.argv[2]);
