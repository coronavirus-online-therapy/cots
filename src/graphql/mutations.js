/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProvider = /* GraphQL */ `
  mutation CreateProvider(
    $input: CreateProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    createProvider(input: $input, condition: $condition) {
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
export const updateProvider = /* GraphQL */ `
  mutation UpdateProvider(
    $input: UpdateProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    updateProvider(input: $input, condition: $condition) {
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
export const deleteProvider = /* GraphQL */ `
  mutation DeleteProvider(
    $input: DeleteProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    deleteProvider(input: $input, condition: $condition) {
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
