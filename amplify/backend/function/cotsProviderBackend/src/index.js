/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authCotsUserPoolId = process.env.AUTH_COTS_USERPOOLID

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');


exports.handler = async (event, context) => {
    const region = process.env.REGION;
    const userPoolId = process.env.AUTH_COTS_USERPOOLID;
    if(region === 'us-east-1-fake') {
        context.done(null, 'test@test.com');
        return;
    }
    const cognito = new AWS.CognitoIdentityServiceProvider({region});
    const listUsersResponse = await cognito
        .listUsers({
            UserPoolId: userPoolId,
            Filter: `sub = "${event.source.owner}"`,
            Limit: 1,
        }).promise();

    console.log(listUsersResponse);
    const email = listUsersResponse.Users[0].Attributes.filter(a => a.Name === 'email').map(a => a.Value)[0]
    console.log(email);
    context.done(null, email);
};
