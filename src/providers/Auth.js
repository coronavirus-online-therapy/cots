import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from "aws-amplify";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
  },
  alert: {
    marginTop: theme.spacing(2),
  },
  authForm: {
    marginTop: '20%',
    padding: theme.spacing(6)
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}));

function ProviderAuth(props) {
  const classes = useStyles();
  const [creds, setCreds] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setCreds({...creds, username: e.target.value.toLowerCase()});
  }
  const handlePasswordChange = (e) => {
    setCreds({...creds, password: e.target.value});
  }
  const handleCodeChange = (e) => {
    setCreds({...creds, code: e.target.value});
  }

  const navigateSignIn = () => {
    setError('');
    props.onStateChange('signIn',{});
  };
  const navigateSignUp = () => {
    setError('');
    props.onStateChange('signUp',{});
  };
  const navigateForgotPassword = () => {
    setError('');
    props.onStateChange('forgotPassword',{});
  };
  const navigateResendCode = () => {
    setError('');
    Auth.resendSignUp(creds.username)
    .then(() => console.log('code resent'))
    .catch((e) => setError(e.message));
  };

  const doSignUp = (e) => {
    e.preventDefault()
    setLoading(true);
    const signup_info = {
      username: creds.username,
      password: creds.password,
      attributes: {},
    }
    setError('');
    Auth.signUp(signup_info)
      .then(data => {
        props.onStateChange('confirmSignUp', data.user.username);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  const doSignUpConfirm = (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');
    Auth.confirmSignUp(creds.username, creds.code)
      .then(() => props.onStateChange('signedUp'))
      .then(() => doSignIn())
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  const doSignIn = (e) => {
    if (e !== undefined) {
      e.preventDefault()
    }
    setLoading(true);
    setError('');
    Auth.signIn(creds.username, creds.password)
        .then(user => {
          if (
            user.challengeName === 'SMS_MFA' ||
            user.challengeName === 'SOFTWARE_TOKEN_MFA'
          ) {
            console.log('confirm user with ' + user.challengeName);
            props.onStateChange('confirmSignIn', user);
          } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            console.log('require new password', user.challengeParam);
            props.onStateChange('requireNewPassword', user);
          } else if (user.challengeName === 'MFA_SETUP') {
            console.log('TOTP setup', user.challengeParam);
            props.onStateChange('TOTPSetup', user);
          } else if (
            user.challengeName === 'CUSTOM_CHALLENGE' &&
            user.challengeParam &&
            user.challengeParam.trigger === 'true'
          ) {
            console.log('custom challenge', user.challengeParam);
            props.onStateChange('customConfirmSignIn', user);
          } else {
            Auth.verifiedContact(user).then(data => {
              if (Object.keys(data.verified).length !== 0) {
                props.onStateChange('signedIn', user);
              } else {
                user = Object.assign(user, data);
                props.onStateChange('verifyContact', user);
              }
            });
          }
        }).catch((e) => {
          if(e.code === "UserNotConfirmedException") {
            console.log('Tried to sign-in with unconfirmed user.  Initiate confirmation.');
            props.onStateChange('confirmSignUp', { username: creds.username });
          } else {
            setError(e.message);
          }
        })
        .finally(() => setLoading(false));
  };

  const renderSignIn = () => {
    return (
      <AuthForm title="Therapist Sign In" onSubmit={doSignIn} error={error}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} align="left">
              <TextField fullWidth required id="email" label="Email"  variant="outlined" 
                          defaultValue={creds.username}
                          autoFocus={true}
                          autoComplete="email"
                          onChange={handleUsernameChange}/>
          </Grid>
          <Grid item xs={12} align="left">
              <TextField fullWidth required id="password" label="Password"  variant="outlined" 
                          type="password"
                          defaultValue={creds.password}
                          autoComplete="new-password"
                          onChange={handlePasswordChange}/>
              <Typography variant="caption">Forgot your password? <Link onClick={navigateForgotPassword}>Reset password</Link></Typography>
          </Grid>
          <Grid item xs={8} align="center">
            <Typography variant="caption">No account? <Link onClick={navigateSignUp}>Create account</Link></Typography>
          </Grid>
          <Grid item xs={4} align="center">
            <div className={classes.buttonWrapper}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>Sign In</Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </Grid>
        </Grid>
      </AuthForm>
    );
  };

  const renderSignUp = () => {
    return (
      <AuthForm title="Therapist Registration" onSubmit={doSignUp} error={error}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} align="left">
              <TextField fullWidth required id="email" label="Email"  variant="outlined" 
                          defaultValue={creds.username}
                          autoFocus={true}
                          autoComplete="email"
                          onChange={handleUsernameChange}/>
          </Grid>
          <Grid item xs={12} align="left">
              <TextField fullWidth required id="password" label="Password"  variant="outlined" 
                          type="password"
                          defaultValue={creds.password}
                          autoComplete="new-password"
                          onChange={handlePasswordChange}/>
          </Grid>
          <Grid item xs={8} align="center">
            <Typography variant="caption">Already registered? <Link onClick={navigateSignIn}>Sign in</Link></Typography>
          </Grid>
          <Grid item xs={4} align="center">
            <div className={classes.buttonWrapper}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>Register</Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </Grid>
        </Grid>
      </AuthForm>
    );
  };
  const renderConfirmSignUp = () => {
    return (
      <AuthForm title="Check Email for Confirmation Code" onSubmit={doSignUpConfirm} error={error}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} align="left">
              <TextField fullWidth required id="email" label="Email"  variant="outlined" 
                          style={{display:'none'}}/>
              <TextField fullWidth required id="code" label="Confirmation Code"  variant="outlined" 
                          defaultValue={creds.code}
                          autoFocus={true}
                          autoComplete="none"
                          type="search"
                          onChange={handleCodeChange}/>
              <Typography variant="caption">Lost your code? <Link onClick={navigateResendCode}>Resend Code</Link></Typography>
          </Grid>
          <Grid item xs={8} align="center">
            <Typography variant="caption"><Link onClick={navigateSignIn}>Back to Sign In</Link></Typography>
          </Grid>
          <Grid item xs={4} align="center">
            <div className={classes.buttonWrapper}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>Confirm</Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </Grid>
        </Grid>
      </AuthForm>
    );
  };

  switch(props.authState) {
    case 'signIn': return renderSignIn();
    case 'signedOut': return renderSignIn();
    case 'signUp': return renderSignUp();
    case 'confirmSignUp': return renderConfirmSignUp();
    case 'signedUp': {
      return null
    }
    case 'signedIn': {
      if(Object.keys(creds).length > 0) {
        setCreds({});
      }
      return null
    }

    default: return null;
  }
}

function AuthForm(props) {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.root}> 
      <Paper className={classes.authForm}>
        <Typography className={classes.title} align="left" variant="h5">
          {props.title}
        </Typography>
        <form autoComplete="off" onSubmit={props.onSubmit}>
          {props.children}
        </form>
        {props.error && <Alert severity="error" className={classes.alert}>{props.error}</Alert>}
      </Paper>
    </Container>
  );
}

export default ProviderAuth;
