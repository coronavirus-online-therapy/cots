import { API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';

class ProviderDetails {
  constructor(props) {
    Object.assign(this, props);
  }

  async read(owner) {
    let { data: {getProvider}} = await API.graphql(graphqlOperation(getProviderWithAccessPoints, {owner}));
    Object.assign(this, getProvider);
    return this;
  }

  async create() {
    this.active = (String(this.active) === 'true');
    this.rate = parseInt(this.rate);
    return await API.graphql(graphqlOperation(mutations.createProvider, {input: this}));
  }
  async update() {
    this.rate = parseInt(this.rate);
    this.active = (String(this.active) === 'true');
    const provider = {...this, accessPoints: undefined};
    return await API.graphql(graphqlOperation(mutations.updateProvider, {input: provider}));
  }

  async addAccessPoint(accessPoint) {
    if(accessPoint.owner === undefined) {
      accessPoint.owner = this.owner
    }
    return await API.graphql(graphqlOperation(createAccessPoint, {input: accessPoint}));
  }
  async updateAccessPoint(accessPoint) {
    if(accessPoint.owner === undefined) {
      accessPoint.owner = this.owner
    }
    return await API.graphql(graphqlOperation(updateAccessPoint, {input: accessPoint}));
  }
  async deleteAccessPoint(accessPoint) {
    if(accessPoint.owner === undefined) {
      accessPoint.owner = this.owner
    }
    return await API.graphql(graphqlOperation(deleteAccessPoint, {input: accessPoint}));
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
          licenseExpiration
          verified
        }
      }
    }
  }
`;

export const updateAccessPoint = /* GraphQL */ `
  mutation UpdateAccessPoint(
    $input: UpdateAccessPointInput!
    $condition: ModelAccessPointConditionInput
  ) {
    updateAccessPoint(input: $input, condition: $condition) {
      state
      owner
    }
  }
`;

export const createAccessPoint = /* GraphQL */ `
  mutation CreateAccessPoint(
    $input: CreateAccessPointInput!
    $condition: ModelAccessPointConditionInput
  ) {
    createAccessPoint(input: $input, condition: $condition) {
      state
      owner
    }
  }
`;
export const deleteAccessPoint = /* GraphQL */ `
  mutation DeleteAccessPoint(
    $input: DeleteAccessPointInput!
    $condition: ModelAccessPointConditionInput
  ) {
    deleteAccessPoint(input: $input, condition: $condition) {
      state
      owner
    }
  }
`;
