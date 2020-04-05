import React, {useState, useEffect}  from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import ProviderAuth from './Auth';
import ProviderProfile from './Profile';
import ProviderDetails from './ProviderDetails';
import { ConfirmSignIn, 
         ForgotPassword, 
         Loading,
         RequireNewPassword, 
         TOTPSetup,
         VerifyContact, 
         Authenticator } from 'aws-amplify-react';
import { datadogLogs } from '@datadog/browser-logs'

function App(props) {
  const [provider, setProvider] = useState(null);
  const [key, setKey] = useState(0);

  if(props.authData) {
    datadogLogs.logger.addContext('username', props.authData.username);
    datadogLogs.logger.addContext('cognitoUser', props.authData.attributes);
  }

  useEffect(() => {
    if (props.authState !== 'signedIn') {
      setProvider(null);
      return;
    }

    const p = new ProviderDetails();
    p.read().then(() => {
      setProvider(p);
    }).catch(e => {
      console.error(e);
      setProvider(null);
    });
  }, [props, key, setProvider]);

  const reloadProvider = () => {
    setKey(key+1);
  };

  // Don't show anything until login is complete
  if (props.authState !== 'signedIn') {
    return null;
  } else if(!provider) {
    return (
      <LinearProgress />
     );
  } else {
    return (<ProviderProfile onChange={reloadProvider} provider={provider}/>);
  }
}

const authTheme = {
  a: {
    color: '#648dae',
  },
  button: {
    color: '#fff',
    backgroundColor: '#648dae',
  },
  navButton: {
    color: '#fff',
    backgroundColor: '#648dae',
  }
};
function AppWithAuth() {
  return (
    <Authenticator 
      authState='signUp'
      usernameAttributes='email' 
      includeGreetings={true}
      hideDefault={true}
      theme={authTheme}
    >
      <ProviderAuth />
      <ConfirmSignIn/>
      <RequireNewPassword/>
      <VerifyContact/>
      <ForgotPassword/>
      <TOTPSetup/>
      <Loading/>
      <App/>
    </Authenticator>

  );
}

export default AppWithAuth;
