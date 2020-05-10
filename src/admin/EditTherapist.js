import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import ProviderDetails from '../providers/ProviderDetails';
import ProviderProfile from '../providers/Profile';
import { Auth, API } from 'aws-amplify';
function EditTherapist() {
  const [error, setError] = React.useState('');
  const [provider, setProvider] = React.useState();
  let email = '';
  const handleEmailChange = (event) => {
    email = event.target.value;
  };
  const handleEmailKeyPress = (event) => {
    if (event.key === 'Enter') {
      doLookup();
      event.preventDefault();
    }
  };
  const doLookup = async () => {
    console.log(`lookup ${email}`);

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

      const providerDetails = new ProviderDetails();
      await providerDetails.read(user.Username);
      console.log(providerDetails);
    } catch (e) {
      setError(e.message);
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
        <TextField fullWidth label="Email"  variant="outlined" onChange={handleEmailChange} onKeyPress={handleEmailKeyPress}/>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" onClick={doLookup}>Lookup</Button>
      </Grid>
      <Grid item xs={12}>
        <Divider/>
        // TODO: show user info here
      </Grid>
      <Grid item xs={12}>
        <Divider/>
        {provider && <ProviderProfile onChange={doLookup} provider={provider}/>}
      </Grid>
    </Grid>
  );
}

export default EditTherapist;
