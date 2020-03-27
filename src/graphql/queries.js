/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProvider = /* GraphQL */ `
  query GetProvider($owner: String!) {
    getProvider(owner: $owner) {
      owner
      firstName
      lastName
      rate
      state
      specialties
      available
    }
  }
`;
export const listProviders = /* GraphQL */ `
  query ListProviders(
    $owner: String
    $filter: ModelProviderFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProviders(
      owner: $owner
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        owner
        firstName
        lastName
        rate
        state
        specialties
        available
      }
      nextToken
    }
  }
`;
export const itemsByState = /* GraphQL */ `
  query ItemsByState(
    $state: String
    $sortDirection: ModelSortDirection
    $filter: ModelProviderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    itemsByState(
      state: $state
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        owner
        firstName
        lastName
        rate
        state
        specialties
        available
      }
      nextToken
    }
  }
`;
