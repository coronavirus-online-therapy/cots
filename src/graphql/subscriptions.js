/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProvider = /* GraphQL */ `
  subscription OnCreateProvider($owner: String) {
    onCreateProvider(owner: $owner) {
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
export const onUpdateProvider = /* GraphQL */ `
  subscription OnUpdateProvider($owner: String) {
    onUpdateProvider(owner: $owner) {
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
export const onDeleteProvider = /* GraphQL */ `
  subscription OnDeleteProvider($owner: String) {
    onDeleteProvider(owner: $owner) {
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
export const onCreateAccessPoint = /* GraphQL */ `
  subscription OnCreateAccessPoint($owner: String) {
    onCreateAccessPoint(owner: $owner) {
      state
      owner
      license
      licenseExpiration
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
export const onUpdateAccessPoint = /* GraphQL */ `
  subscription OnUpdateAccessPoint($owner: String) {
    onUpdateAccessPoint(owner: $owner) {
      state
      owner
      license
      licenseExpiration
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
export const onDeleteAccessPoint = /* GraphQL */ `
  subscription OnDeleteAccessPoint($owner: String) {
    onDeleteAccessPoint(owner: $owner) {
      state
      owner
      license
      licenseExpiration
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
