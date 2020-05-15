import React from 'react';

import ProviderAuth from './Auth';
import ProviderProfile from './Profile';
import { ConfirmSignIn, 
         Loading,
         RequireNewPassword, 
         TOTPSetup,
         VerifyContact, 
         Authenticator } from 'aws-amplify-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { datadogLogs } from '@datadog/browser-logs'

function App(props) {
  const [viewMode, setViewMode] = React.useState(true);
  if(props.authState !== 'signedIn') {
    return null;
  }

  datadogLogs.logger.addContext('username', props.authData.username);
  datadogLogs.logger.addContext('cognitoUser', props.authData.attributes);

  const reload = (response) => {
    if(response.data.updateProvider !== undefined) {
      window.location.reload(false);
    } else {
      setViewMode(true);
    }
  };

  const navigateEdit = () => {
    setViewMode(false);
  }

  const handleLoad = (provider) => {
    if(provider.owner === undefined) {
      navigateEdit();
    }
  }

  return (
    <Container maxWidth="md">
      <Paper style={{ margin: 16}}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={7}>
            <Typography variant="h5" component="h5" align="right">
              Therapist Profile
            </Typography>
          </Grid>
          <Grid item xs={3}> 
              {viewMode && 
                <div>
                <Button variant="contained" color="primary" onClick={navigateEdit}><EditIcon/></Button>
                <div>
                <Typography>
                  Edit
                </Typography>
                </div>
                </div>
              }
          </Grid>
          <Grid item xs={12}> 
            <ProviderProfile providerId={props.authData.username} onLoad={handleLoad} onChange={reload} viewMode={viewMode}/>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
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
