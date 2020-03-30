import React, {useState, useEffect}  from 'react';

import { withAuthenticator } from "aws-amplify-react";
import ProviderProfile from './Profile';
import ProviderDetails from './ProviderDetails';

function App() {
  const [provider, setProvider] = useState(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let p = new ProviderDetails();
    p.read().then(() => {
      setProvider(p);
    }).catch(e => {
      setProvider(null);
    });
  }, [key, setProvider]);

  const changeHandler = (e) => {
    setKey(key+1);
  };

  // Don't show anything until login is complete
  if(!provider) {
    return (<div>Login required.</div>)
  } else {
    return (<ProviderProfile onChange={changeHandler} provider={provider}/>);
  }
}

const signUpConfig =  {
  hiddenDefaults: ['username', 'phone_number']
};

let authenticatedComponent = withAuthenticator(App, { usernameAttributes: 'email', signUpConfig, includeGreetings: true });
authenticatedComponent.defaultProps = { authState: 'signUp' }
export default authenticatedComponent;
