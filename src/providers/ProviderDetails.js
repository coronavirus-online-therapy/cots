import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';

class ProviderDetails {
  constructor(props) {
    Object.assign(this, props);
  }
  valueChangeHandler(fieldName) {
    return function(val) {
      if(val.target) {
        if('checked' in val.target) {
          val = val.target.checked;
        } else {
          val = val.target.value;
        }
      }
      this[fieldName] = val;
    }.bind(this)
  }

  async create() {
    let user = await Auth.currentAuthenticatedUser();
    this.owner = user.getUsername();
    this.available = true;
    this.rate = parseInt(this.rate);
    return await API.graphql(graphqlOperation(mutations.createProvider, {input: this}));
  }
  async update() {
    let user = await Auth.currentAuthenticatedUser();
    this.owner = user.getUsername();
    this.rate = parseInt(this.rate);
    console.log(this);
    this.available = (String(this.available) === 'true');
    return await API.graphql(graphqlOperation(mutations.updateProvider, {input: this}));
  }
}

export default ProviderDetails;
