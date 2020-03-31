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

    console.log(results.map(r => {return {provider: r.provider.owner, score: r.score}}));
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


const scorers = {
    rate: (p, q) => {
        if(p <= q) {
            return 1;
        }
        const scale = 50;
        return (q-p) / scale;
    },
    gender: (p, q) => {
        if(p === undefined) {
            return 0;
        } 
        return p===q?1:-1;
    },
    languages: scoreLists,
    acceptedInsurance: scoreLists,
    specializations: scoreLists,
    modalities: scoreLists,
};
const weights = {
    rate: 50,
    languages: 10,
    gender: 5,
    acceptedInsurance: 5,
};

function scoreProvider(query, provider) {

    const scores = Object.entries(query).reduce((scores, keypair) => {
        const field = keypair[0];
        if(!(field in scorers) || keypair[1] === null || keypair[1].length === 0) {
            return scores;
        }
        const score = Math.min(1, Math.max(-1,scorers[field](provider[field], keypair[1])));
        const weight = (field in weights)?weights[field]:1;
        scores[field] = [score, weight]
        return scores;
    }, {});

    const [sumScore, sumWeight] = Object.values(scores).reduce(([score, weight], field) => {
        return [score + (field[0] * field[1]), weight + field[1]]
    }, [0, 0]);

    let score = sumScore/sumWeight;
    if(isNaN(score)) {
        score = 0;
    }

    const logMessage = {
        query,
        provider: provider.owner,
        score,
        scores,
    }
    console.log(logMessage);

    return score;
}

function scoreLists(pList, qList) {
    if(pList === undefined || pList === null || pList.length === 0) 
    {
        return 0;
    } 
    const sum = qList.reduce((sum, item) => {
        if(pList.includes(item)) {
            return sum + 1;
        } else {
            return sum - 1;
        }
    }, 0);
    return sum/qList.length;
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

