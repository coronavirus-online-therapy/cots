/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProvider = /* GraphQL */ `
  mutation CreateProvider(
    $input: CreateProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    createProvider(input: $input, condition: $condition) {
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
export const updateProvider = /* GraphQL */ `
  mutation UpdateProvider(
    $input: UpdateProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    updateProvider(input: $input, condition: $condition) {
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
export const deleteProvider = /* GraphQL */ `
  mutation DeleteProvider(
    $input: DeleteProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    deleteProvider(input: $input, condition: $condition) {
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
export const createAccessPoint = /* GraphQL */ `
  mutation CreateAccessPoint(
    $input: CreateAccessPointInput!
    $condition: ModelAccessPointConditionInput
  ) {
    createAccessPoint(input: $input, condition: $condition) {
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
export const updateAccessPoint = /* GraphQL */ `
  mutation UpdateAccessPoint(
    $input: UpdateAccessPointInput!
    $condition: ModelAccessPointConditionInput
  ) {
    updateAccessPoint(input: $input, condition: $condition) {
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
export const deleteAccessPoint = /* GraphQL */ `
  mutation DeleteAccessPoint(
    $input: DeleteAccessPointInput!
    $condition: ModelAccessPointConditionInput
  ) {
    deleteAccessPoint(input: $input, condition: $condition) {
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
