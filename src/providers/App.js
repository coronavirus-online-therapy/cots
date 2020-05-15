import React from 'react';

import ProviderAuth from './Auth';
import ProviderProfile from './Profile';
import { ConfirmSignIn, 
         Loading,
         RequireNewPassword, 
         TOTPSetup,
         VerifyContact, 
         Authenticator } from 'aws-amplify-react';
import { datadogLogs } from '@datadog/browser-logs'

function App(props) {
  if(props.authState !== 'signedIn') {
    return null;
  }

  datadogLogs.logger.addContext('username', props.authData.username);
  datadogLogs.logger.addContext('cognitoUser', props.authData.attributes);

  const reload = (response) => {
    if(response.data.updateProvider !== undefined) {
      window.location.reload(false);
    }
  };

  return (<ProviderProfile providerId={props.authData.username} onChange={reload}/>);
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
      <TOTPSetup/>
      <Loading/>
      <App/>
    </Authenticator>

  );
}

export default AppWithAuth;
