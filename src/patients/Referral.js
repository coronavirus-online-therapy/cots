import { API } from "aws-amplify";

class Referral {
  constructor(props) {
    Object.assign(this, props);
    this.providers = [];
    this.limit = 100;
  }

  async execute() {
    const queryParams = ['state','rate','gender','acceptedInsurance','specializations','modalities','languages'];
    const query = Object.entries(this).reduce((q, keypair) => {
      if(queryParams.includes(keypair[0])) {
        q[keypair[0]] = keypair[1];
      }
      return q;
    }, {});
    try {
      const {data: {referrals}} = await API.graphql({
        query: referralsQuery,
        variables: {
          query,
          limit: 3,
        },
        authMode: 'API_KEY'
      });
      console.log(this);
      return referrals.map(a => {return{...a.provider, score: a.score}});
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}


export default Referral;

export const referralsQuery = /* GraphQL */ `
  query Referrals(
    $query: ReferralQuery
    $limit: Int
  ) {
    referrals(
      query: $query
      limit: $limit
    ) {
      score 
      provider {
        owner
        fullName
        licenseType
        phone
        url
        email
        acceptedInsurance
        specializations
        modalities
        languages
        rate
      }
    }
  }
`;

