import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';

class ProviderDetails {
  constructor(props) {
    Object.assign(this, props);
  }
  valueChangeHandler(fieldName) {
    return function(val) {
      if(val.target) {
        val = val.target.value;
      }
      this[fieldName] = val;
    }.bind(this)
  }

  async create() {
    let user = await Auth.currentAuthenticatedUser();
    this.owner = user.getUsername();
    this.active = true;
    this.rate = parseInt(this.rate);
    return await API.graphql(graphqlOperation(mutations.createProvider, {input: this}));
  }
  async update() {
    let user = await Auth.currentAuthenticatedUser();
    this.owner = user.getUsername();
    this.rate = parseInt(this.rate);
    this.active = (String(this.active) === 'true');
    return await API.graphql(graphqlOperation(mutations.updateProvider, {input: this}));
  }
}

export default ProviderDetails;
