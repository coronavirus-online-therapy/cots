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
import ReactGA from 'react-ga';

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
  const [forgotStarted, setForgotStarted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setCreds({...creds, username: e.target.value.toLowerCase().trim()});
  }
  const handlePasswordChange = (e) => {
    setCreds({...creds, password: e.target.value});
  }
  const handleCodeChange = (e) => {
    setCreds({...creds, code: e.target.value.trim()});
  }

  const handleAuthError = (e) => {
    ReactGA.exception({description: e.message});
    console.error({...e, cognitoUser: {email: creds.username}}); 
    setError(e.message);
  };

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
    .catch(handleAuthError);
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
      .then(() => ReactGA.event({category: 'Therapist', action: 'Sign Up'}))
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  };
  const doSignUpConfirm = (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');
    Auth.confirmSignUp(creds.username, creds.code)
      .then(() => props.onStateChange('signedUp'))
      .then(() => ReactGA.event({category: 'Therapist', action: 'Confirm Sign Up'}))
      .then(() => doSignIn())
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  };
  const doForgotPassword = (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');
    Auth.forgotPassword(creds.username)
      .then(() => setForgotStarted(true))
      .then(() => ReactGA.event({category: 'Therapist', action: 'Forgot Password'}))
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  }
  const doForgotPasswordSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');
    Auth.forgotPasswordSubmit(creds.username, creds.code, creds.password)
      .then(() => {
        setForgotStarted(false);
        doSignIn(e);
      })
      .then(() => ReactGA.event({category: 'Therapist', action: 'Forgot Password Submit'}))
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  }
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
                ReactGA.set({ userId: creds.username });
                props.onStateChange('signedIn', user);
              } else {
                user = Object.assign(user, data);
                props.onStateChange('verifyContact', user);
              }
            });
          }
        })
        .then(() => ReactGA.event({category: 'Therapist', action: 'Sign In'}))
        .catch((e) => {
          if(e.code === "UserNotConfirmedException") {
            console.log('Tried to sign-in with unconfirmed user.  Initiate confirmation.');
            props.onStateChange('confirmSignUp', { username: creds.username });
          } else {
            handleAuthError(e);
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
                          name="email"
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
      <Container maxWidth="md">
       <Paper className={classes.root}>
        <Typography variant="h2" component="h2" className={classes.title}>
          - Therapists, Please Join Us! - 
        </Typography>
        <Container maxWidth="md" align="center">
          <br/>
          <Typography>
          <strong>We are presently inviting licensed, insured therapists authorized for unsupervised private practice to join our collective. </strong> (We cannot accept interns and associates who do not meet these criteria at this time. <strong> If you aren’t yet licensed for independent clinical practice, <i> please stop </i> and instead </strong> <Link href="https://www.coronavirusonlinetherapy.org/intern-therapist-waitlist" target="_blank"><u><i> sign up for our waiting list </i></u></Link>) Therapists joining us must be willing to offer short-term (minimum four online sessions per accepted referral) pro-bono sessions or fees of $50 or less.
          </Typography>
          <br/>
          <Typography>
          We are also very aware of the need to support our therapists, and are presently working on ways to do so.  All of our therapists are invited to join our private <Link href="https://www.facebook.com/groups/coronavirusonlinetherapyproviders/" target="_blank"><u><i>Therapist Facebook Group </i></u></Link>&nbsp;to connect with one another, find answers to commonly asked questions, and to support one another.
          </Typography>
          <br/>
          <Typography>
          Before you create a profile, we ask that you please read our <Link href="https://www.coronavirusonlinetherapy.com/therapist-portal-faq" target="_blank"><u> Therapist Portal FAQ </u></Link>  to ensure an easy signup process.
          </Typography>
          <br/>
          <Typography>
          <strong>PLEASE NOTE:</strong> These are private practice referrals. Therapists are responsible for collecting fees, documentation, and choice of online platform to conduct sessions on. <strong>Coronavirus Online Therapy does not pay therapists. </strong>  You must confirm fees and payment methods with clients prior to rendering services, as you would with any private practice referral. <strong>By creating a profile, you will be subscribed to our administrative emails. Should you unsubscribe, we will need to delete your profile.</strong> 
          </Typography>
        </Container>
		  <AuthForm title="Therapist Registration" onSubmit={doSignUp} error={error}>
			<Grid container spacing={3} justify="center">
			  <Grid item xs={12} align="left">
				  <TextField fullWidth required id="email" label="Office Email"  variant="outlined" 
							  defaultValue={creds.username}
                name="email"
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
		 </Paper>
		</Container>  
    );
  };
  const renderConfirmSignUp = () => {
    return (
      <AuthForm title="Check Email for Confirmation Code" onSubmit={doSignUpConfirm} error={error}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} align="left">
              <TextField fullWidth id="email" label="Email"  variant="outlined" 
                          style={{display:'none'}}/>
              <TextField fullWidth required id="code" label="Confirmation Code"  variant="outlined" 
                          defaultValue={creds.code}
                          name="code"
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
  const renderForgotPassword = () => {
    return (
      <AuthForm title="Reset Your Password" onSubmit={doForgotPassword} error={error}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} align="left">
              <TextField fullWidth required id="email" label="Office Email"  variant="outlined" 
                    defaultValue={creds.username}
                    name="email"
                    autoFocus={true}
                    autoComplete="email"
                    onChange={handleUsernameChange}/>
          </Grid>
          <Grid item xs={8} align="center">
            <Typography variant="caption"><Link onClick={navigateSignIn}>Back to Sign In</Link></Typography>
          </Grid>
          <Grid item xs={4} align="center">
            <div className={classes.buttonWrapper}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>Send Code</Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </Grid>
        </Grid>
      </AuthForm>
    );
  };
  const renderForgotPasswordSubmit = () => {
    return (
      <AuthForm title="Reset Your Password" onSubmit={doForgotPasswordSubmit} error={error}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} align="left">
              <TextField fullWidth id="email" label="Email"  variant="outlined" 
                          style={{display:'none'}}/>
              <TextField fullWidth required id="code" label="Confirmation Code"  variant="outlined" 
                          defaultValue={creds.code}
                          name="code"
                          autoFocus={true}
                          autoComplete="none"
                          type="search"
                          onChange={handleCodeChange}/>
          </Grid>
          <Grid item xs={12} align="left">
              <TextField fullWidth required id="password" label="New Password"  variant="outlined" 
                          type="password"
                          defaultValue={creds.password}
                          autoComplete="new-password"
                          onChange={handlePasswordChange}/>
          </Grid>
          <Grid item xs={8} align="center">
              <Typography variant="caption">Lost your code? <Link onClick={doForgotPassword}>Resend Code</Link></Typography>
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
    case 'forgotPassword': return !forgotStarted?renderForgotPassword():renderForgotPasswordSubmit();
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
