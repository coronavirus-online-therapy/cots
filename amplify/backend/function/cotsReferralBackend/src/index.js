/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiCotsGraphQLAPIIdOutput = process.env.API_COTS_GRAPHQLAPIIDOUTPUT
var apiCotsGraphQLAPIEndpointOutput = process.env.API_COTS_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

const http = require('http');
const https = require('https');
const AWS = require("aws-sdk");
const urlParse = require("url").URL;

exports.handler = async (event, context) => {
    console.log(event.arguments);

    // fetch access points state
    const accessPoints = await getAccessPoints(event.arguments.query.state, 100);
    const providers = accessPoints.map(ap => ap.provider).filter(p => p.active);

    // score & sort
    const results = providers.map(score(event.arguments.query));
    results.sort((a,b) => {return b.score - a.score});

    // trim to length
    results.length = Math.min(results.length, event.arguments.limit);

    console.log(results);
    context.done(null, results);
};

function score(query) {
    return (provider) => {
        const score = scoreProvider(query, provider);
        return {
            provider,
            score,
        };
    };
}


const scorers = [
    { func: scoreProviderRate, weight: 20 },
    { func: scoreProviderLanguages, weight: 10 },
    { func: scoreProviderGender, weight: 5 },
    { func: scoreProviderInsurance, weight: 5 },
    { func: scoreProviderSpecializations, weight: 1 },
    { func: scoreProviderModalities, weight: 1 },
];
function scoreProvider(query, provider) {
    const scoreSum = scorers.reduce((sum, scorer) => {
        const s = Math.min(1, Math.max(-1, scorer.func(query, provider)));
        return sum + (scorer.weight * s);
    }, 0);
    const scoreWeight = scorers.reduce((sum, scorer) => sum + scorer.weight, 0);
    return scoreSum/scoreWeight;
}
function scoreProviderRate(query, provider) {
    if(query.rate >= provider.rate) {
        return 1;
    } 
    const scale = 50;
    return (query.rate - provider.rate) / scale;
}
function scoreProviderLanguages(query, provider) {
    return scoreLists(query.languages, provider.languages);
}
function scoreProviderGender(query, provider) {
    if(query.gender === undefined || provider.gender === undefined) {
        return 0;
    } 
    if(query.gender === provider.gender) {
        return 1;
    } 
    return -1;
}
function scoreProviderInsurance(query, provider) {
    return scoreLists(query.acceptedInsurance, provider.acceptedInsurance);
}
function scoreProviderSpecializations(query, provider) {
    return scoreLists(query.specializations, provider.specializations);
}
function scoreProviderModalities(query, provider) {
    return scoreLists(query.modalities, provider.modalities);
}
function scoreLists(queryList, providerList) {
    if(queryList === undefined 
        || queryList === null 
        || queryList.length === 0 
        || providerList === undefined 
        || providerList === null 
        || providerList.length === 0) 
    {
        return 0;
    } 
    const sum = queryList.reduce((sum, item) => {
        if(providerList.includes(item)) {
            return sum + 1;
        }
        return sum;
    }, 0);
    return sum/queryList.length;
}

async function getAccessPoints(state, limit) {
    const appsyncUrl = process.env.API_COTS_GRAPHQLAPIENDPOINTOUTPUT;
    const endpoint = new urlParse(appsyncUrl).hostname.toString();
    const port = new urlParse(appsyncUrl).port.toString();
    const protocol = new urlParse(appsyncUrl).protocol.toString();
    const region = process.env.REGION;
    const req = new AWS.HttpRequest(appsyncUrl, region);

    req.method = "POST";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: accessPointsByStateWithProvider,
        operationName: "AccessPointsByState",
        variables: {
            state,
            limit,
        }
    });

    if(region === 'us-east-1-fake') {
        req.headers["x-api-key"] = "da2-fakeApiId123456";
    } else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const resp = await new Promise((resolve, reject) => {
        const client = (protocol==='https:'?https:http);
        const httpRequest = client.request({ ...req, host: endpoint, port}, (result) => {
            result.on('data', (data) => {
                resolve(JSON.parse(data.toString()));
            });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });

    if(resp.errors) {
        console.log(resp);
        throw new Error("Error loading AccessPoints");
    }

    return resp.data.accessPointsByState.items;
};

const accessPointsByStateWithProvider = /* GraphQL */ `
  query AccessPointsByState(
    $state: String
    $limit: Int
    $nextToken: String
  ) {
    accessPointsByState(
      state: $state
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        provider {
          owner
          fullName
          licenseType
          phone
          url
          gender
          liabilityPolicy
          acceptedInsurance
          active
          availability {
              day
              hour
              min
              duration
          }
          specializations
          modalities
          languages
          rate
        }
      }
      nextToken
    }
  }
`;

