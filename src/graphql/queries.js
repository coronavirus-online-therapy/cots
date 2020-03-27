/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncProviders = /* GraphQL */ `
  query SyncProviders(
    $filter: ModelProviderFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProviders(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        firstName
        lastName
        rate
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getProvider = /* GraphQL */ `
  query GetProvider($id: ID!) {
    getProvider(id: $id) {
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
export const listProviders = /* GraphQL */ `
  query ListProviders(
    $filter: ModelProviderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProviders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        rate
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
