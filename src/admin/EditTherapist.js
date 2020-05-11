import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import ProviderProfile from '../providers/Profile';
import UserInfo from './UserInfo';
import { Auth, API } from 'aws-amplify';

function EditTherapist() {
  const [error, setError] = React.useState('');
  const [user, setUser] = React.useState();
  const [email, setEmail] = React.useState('');
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleEmailKeyPress = (event) => {
    if (event.key === 'Enter') {
      doLookup();
      event.preventDefault();
    }
  };
  const doLookup = async () => {
    setError('');
    setUser(undefined);

    try {
      const user = await API.get('AdminQueries', '/getUser', 
        {
          queryStringParameters: {username: email},
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          } 
        }
      );
      setUser(user);
    } catch (e) {
      if (e.response !== undefined) {
        setError(e.response.data.message)
      } else {
        setError(e.message);
      }
    }

  };
  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={12}>
        <Typography variant="h5" component="h5" align="center">
          Edit Therapist
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth label="Email"  variant="outlined" onChange={handleEmailChange} onKeyPress={handleEmailKeyPress} defaultValue={email}/>
        {error && <Alert severity="error" variant="filled">{error}</Alert>}
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" onClick={doLookup}>Lookup</Button>
      </Grid>
      {user && 
        <Grid item xs={12}>
          <UserInfo user={user}/>
        </Grid>
      }
      {user && 
        <Grid item xs={12}>
          <Divider/>
          <ProviderProfile providerId={user.Username}/>
        </Grid>
      }
    </Grid>
  );
}

export default EditTherapist;
