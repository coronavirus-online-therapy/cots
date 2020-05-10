import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';

class ProviderDetails {
  constructor(props) {
    Object.assign(this, props);
  }

  async read(owner) {
    if(owner === undefined) {
      let user = await Auth.currentAuthenticatedUser();
      if(user && user.getUsername()) {
        owner = user.getUsername();
      } else {
        throw new Error("No current authenticated user.");
      }
    }
    let { data: {getProvider}} = await API.graphql(graphqlOperation(getProviderWithAccessPoints, {owner}));
    Object.assign(this, getProvider);
  }

  async create() {
    if(this.owner === undefined) {
      let user = await Auth.currentAuthenticatedUser();
      this.owner = user.getUsername();
    }
    this.active = (String(this.active) === 'true');
    this.rate = parseInt(this.rate);
    return await API.graphql(graphqlOperation(mutations.createProvider, {input: this}));
  }
  async update() {
    if(this.owner === undefined) {
      let user = await Auth.currentAuthenticatedUser();
      this.owner = user.getUsername();
    }
    this.rate = parseInt(this.rate);
    this.active = (String(this.active) === 'true');
    this.accessPoints = undefined;
    return await API.graphql(graphqlOperation(mutations.updateProvider, {input: this}));
  }

  async addAccessPoint(accessPoint) {
    if(accessPoint.owner === undefined) {
      if(this.owner === undefined) {
        let user = await Auth.currentAuthenticatedUser();
        accessPoint.owner = user.getUsername();
      } else {
        accessPoint.owner = this.owner
      }
    }
    return await API.graphql(graphqlOperation(mutations.createAccessPoint, {input: accessPoint}));
  }
  async updateAccessPoint(accessPoint) {
    if(accessPoint.owner === undefined) {
      if(this.owner === undefined) {
        let user = await Auth.currentAuthenticatedUser();
        accessPoint.owner = user.getUsername();
      } else {
        accessPoint.owner = this.owner
      }
    }
    return await API.graphql(graphqlOperation(mutations.updateAccessPoint, {input: accessPoint}));
  }
  async deleteAccessPoint(accessPoint) {
    if(accessPoint.owner === undefined) {
      if(this.owner === undefined) {
        let user = await Auth.currentAuthenticatedUser();
        accessPoint.owner = user.getUsername();
      } else {
        accessPoint.owner = this.owner
      }
    }
    return await API.graphql(graphqlOperation(mutations.deleteAccessPoint, {input: accessPoint}));
  }

  getAccessPoints() {
    if(this.accessPoints !== undefined && this.accessPoints.items !== undefined) {
      return this.accessPoints.items;
    }
    return [];
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
