# Local Development
`yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


# Setup
* Prereqs: NodeJS, Amplify, yarn (see Environment section)

`yarn`

Installs all the packages listed in package.json.

`amplify init`
* Prereq: IAM user with admin access
* Use existing environment? No
* environment name: dev
* editor: vim
* Use AWS profile? No
* accessKeyID (copy/paste from IAM)
* secretAccessKey (copy/paste from a credentials.csv)
* region: us-east-1
* lambda triggers for cognito? No
* name of group: cots

Initializes an amplify dev environment. 

`amplify publish`

Deploys resources to AWS.


# Environment
`brew install nodejs`

Installs latest version (14.2) of Node.js.

`npm install -g @aws-amplify/cli`

Installs Amplify tools.

`npm install -g yarn`

Installs the yarn package manager globally.

IAM > Users > Add Users
* User name: amplify-admin
* Programmatic access
* Attach existing policy: AdministratorAccess