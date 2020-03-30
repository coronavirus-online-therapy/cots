import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';

class ProviderDetails {
  constructor(props) {
    Object.assign(this, props);
  }

  async read() {
    let user = await Auth.currentAuthenticatedUser();
    if(user && user.getUsername()) {
      let { data: {getProvider}} = await API.graphql(graphqlOperation(getProviderWithAccessPoints, {owner: user.getUsername()}));
      Object.assign(this, getProvider);
    } else {
      throw new Error("No current authenticated user.");
    }
  }

  async create() {
    let user = await Auth.currentAuthenticatedUser();
    this.owner = user.getUsername();
    this.active = true;
    this.rate = parseInt(this.rate);
    return await API.graphql(graphqlOperation(mutations.createProvider, {input: this}));
  }
  async update() {
    let user = await Auth.currentAuthenticatedUser();
    this.owner = user.getUsername();
    this.rate = parseInt(this.rate);
    this.active = (String(this.active) === 'true');
    this.accessPoints = undefined;
    return await API.graphql(graphqlOperation(mutations.updateProvider, {input: this}));
  }

  async addAccessPoint(accessPoint) {
    let user = await Auth.currentAuthenticatedUser();
    accessPoint.owner = user.getUsername();
    return await API.graphql(graphqlOperation(mutations.createAccessPoint, {input: accessPoint}));
  }
  async updateAccessPoint(accessPoint) {
    let user = await Auth.currentAuthenticatedUser();
    accessPoint.owner = user.getUsername();
    return await API.graphql(graphqlOperation(mutations.updateAccessPoint, {input: accessPoint}));
  }
  async deleteAccessPoint(accessPoint) {
    let user = await Auth.currentAuthenticatedUser();
    accessPoint.owner = user.getUsername();
    return await API.graphql(graphqlOperation(mutations.deleteAccessPoint, {input: accessPoint}));
  }
}

export default ProviderDetails;

const getProviderWithAccessPoints = /* GraphQL */ `
  query GetProvider($owner: String!) {
    getProvider(owner: $owner) {
      owner
      fullName
      licenseType
      liabilityPolicy
      phone
      url
      rate
      acceptedInsurance
      gender
      specializations
      modalities
      languages
      active
      availability {
        day
        hour
        min
        duration
      }
      tosAcceptedAt
      accessPoints {
        items {
          state
          license
        }
      }
    }
  }
`;
