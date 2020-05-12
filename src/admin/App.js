import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import EditTherapist from './EditTherapist';
import Navigation from './Navigation';
import ProviderAuth from '../providers/Auth';
import { ConfirmSignIn, 
         Loading,
         RequireNewPassword, 
         TOTPSetup,
         VerifyContact, 
         Authenticator } from 'aws-amplify-react';
import { datadogLogs } from '@datadog/browser-logs'

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
      marginLeft: theme.spacing(7)+1,
    '& > * + *': {
      marginTop: theme.spacing(10),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


function Denied() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <Alert severity="error" variant="filled">Access Denied!</Alert>
        </Paper>
      </Container>
    </div>
  );
}
function App(props) {
  const classes = useStyles();
  const [adminAction, setAdminAction] = React.useState(<EditTherapist/>);

  if(props.authData) {
    datadogLogs.logger.addContext('username', props.authData.username);
    datadogLogs.logger.addContext('cognitoUser', props.authData.attributes);
  }

  // Don't show anything until login is complete
  if (props.authState !== 'signedIn') {
    return null;
  } else {
    const groups = props.authData.signInUserSession.accessToken.payload["cognito:groups"]
    if (!groups.includes('admin')) {
      return Denied();
    }
    return (

      <div className={classes.root}>
        <Navigation onAdminActionChange={setAdminAction}/>
        <Container maxWidth="md">
          <Paper>
            { adminAction } 
          </Paper>
        </Container>
      </div>
    )
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
      authState='signIn'
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
