/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const referrals = /* GraphQL */ `
  query Referrals($query: ReferralQuery, $limit: Int = 3) {
    referrals(query: $query, limit: $limit) {
      score
      provider {
        owner
        fullName
        licenseType
        liabilityPolicy
        email
        phone
        url
        rate
        acceptedInsurance
        gender
        specializations
        modalities
        languages
        active
        tosAcceptedAt
      }
      verified
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
        fullName
        licenseType
        liabilityPolicy
        email
        phone
        url
        rate
        acceptedInsurance
        gender
        specializations
        modalities
        languages
        active
        tosAcceptedAt
      }
      nextToken
    }
  }
`;
export const getProvider = /* GraphQL */ `
  query GetProvider($owner: String!) {
    getProvider(owner: $owner) {
      owner
      fullName
      licenseType
      liabilityPolicy
      email
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
        nextToken
      }
    }
  }
`;
export const getAccessPoint = /* GraphQL */ `
  query GetAccessPoint($owner: String!, $state: String!) {
    getAccessPoint(owner: $owner, state: $state) {
      state
      owner
      license
      verified
      provider {
        owner
        fullName
        licenseType
        liabilityPolicy
        email
        phone
        url
        rate
        acceptedInsurance
        gender
        specializations
        modalities
        languages
        active
        tosAcceptedAt
      }
    }
  }
`;
export const listAccessPoints = /* GraphQL */ `
  query ListAccessPoints(
    $owner: String
    $state: ModelStringKeyConditionInput
    $filter: ModelAccessPointFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAccessPoints(
      owner: $owner
      state: $state
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        state
        owner
        license
        verified
      }
      nextToken
    }
  }
`;
export const accessPointsByState = /* GraphQL */ `
  query AccessPointsByState(
    $state: String
    $sortDirection: ModelSortDirection
    $filter: ModelAccessPointFilterInput
    $limit: Int
    $nextToken: String
  ) {
    accessPointsByState(
      state: $state
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        state
        owner
        license
        verified
      }
      nextToken
    }
  }
`;
