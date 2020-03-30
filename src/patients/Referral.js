import { API } from "aws-amplify";

class Referral {
  constructor(props) {
    Object.assign(this, props);
    this.providers = [];
    this.limit = 100;
  }

  async execute() {
    const vars = {
      state: this.state,
      limit: this.limit
    }
    try {
      const {data: {accessPointsByState}} = await API.graphql({
        query: accessPointsByStateWithProvider,
        variables: vars,
        authMode: 'API_KEY'
      })
      let ap = accessPointsByState.items.map(a => a.provider).filter(this.filter.bind(this));
      console.log(ap);
      return ap;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  filter(provider) {
    if(this.rate !== undefined && this.rate < provider.rate) {
      return false;
    }
    return true;
  }
}


export default Referral;

export const accessPointsByStateWithProvider = /* GraphQL */ `
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
        license
        provider {
          owner
          fullName
          licenseType
          phone
          url
          acceptedInsurance
          specializations
          modalities
          languages
          rate
        }
      }
      nextToken
    }
  }
`;

