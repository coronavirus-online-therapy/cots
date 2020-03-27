import React from 'react';
import './App.css';

import Amplify  from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator} from 'aws-amplify-react'; 

import ProviderApp from './providers/App';

Amplify.configure(awsconfig);

function App(props) {
  return (
    <div className="App">
      <ProviderApp/>
    </div>
  );
}
const signUpConfig =  {
  hiddenDefaults: ['username', 'phone_number']
};

let authenticatedComponent = withAuthenticator(App, { usernameAttributes: 'email', signUpConfig, includeGreetings: true });
authenticatedComponent.defaultProps = { authState: 'signUp' }
export default authenticatedComponent;
