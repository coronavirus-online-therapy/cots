import React from 'react';
import './App.css';

import Amplify  from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator} from 'aws-amplify-react'; 

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      Hello world
    </div>
  );
}
const signUpConfig =  {
  hiddenDefaults: ['username', 'phone_number']
};

let authenticatedComponent = withAuthenticator(App, { usernameAttributes: 'email', signUpConfig, includeGreetings: true });
authenticatedComponent.defaultProps = { authState: 'signUp' }
export default authenticatedComponent;
