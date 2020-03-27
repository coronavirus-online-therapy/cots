/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProvider = /* GraphQL */ `
  subscription OnCreateProvider($owner: String) {
    onCreateProvider(owner: $owner) {
      owner
      firstName
      lastName
      rate
      state
      specialties
      available
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateProvider = /* GraphQL */ `
  subscription OnUpdateProvider($owner: String!) {
    onUpdateProvider(owner: $owner) {
      owner
      firstName
      lastName
      rate
      state
      specialties
      available
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteProvider = /* GraphQL */ `
  subscription OnDeleteProvider($owner: String!) {
    onDeleteProvider(owner: $owner) {
      owner
      firstName
      lastName
      rate
      state
      specialties
      available
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
