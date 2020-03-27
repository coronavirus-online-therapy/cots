/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProvider = /* GraphQL */ `
  subscription OnCreateProvider($owner: String) {
    onCreateProvider(owner: $owner) {
      id
      firstName
      lastName
      rate
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const onUpdateProvider = /* GraphQL */ `
  subscription OnUpdateProvider($owner: String!) {
    onUpdateProvider(owner: $owner) {
      id
      firstName
      lastName
      rate
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const onDeleteProvider = /* GraphQL */ `
  subscription OnDeleteProvider($owner: String!) {
    onDeleteProvider(owner: $owner) {
      id
      firstName
      lastName
      rate
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
