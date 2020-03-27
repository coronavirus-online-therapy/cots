import React, {useState, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { makeStyles } from '@material-ui/core/styles';

import StateSelect from '../common/StateSelect';
import RateSelect from '../common/RateSelect';
import ErrorSnackbar from '../common/ErrorSnackbar';
import ProviderDetails from './ProviderDetails';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));



function Edit(props) {
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [providerDetails, setProviderDetails] = useState(new ProviderDetails(props.provider));

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmit(true);
  };

  useEffect(() => {
    if(!submit) {
      return;
    }
    const updateProvider = async () => {
      try {
        await providerDetails.update();
        setEdit(false);
      } catch({data, errors}) {
        setError(errors.map(e => e.message));
      }
      setSubmit(false);
    };
    updateProvider();
  }, [submit, providerDetails, props]);

  const handleCheck = event => {
    let pd = new ProviderDetails(providerDetails);
    pd[event.target.name] = event.target.checked;
    setProviderDetails(pd);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                  <Typography variant="h3" component="h2">
                    Therapist Profile 
                    {!edit && <Button variant="contained" color="primary" onClick={setEdit}><EditIcon/></Button>}
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField required id="first-name" label="First Name"  variant="outlined" 
                               disabled={!edit}
                               defaultValue={providerDetails.firstName} 
                               onChange={providerDetails.valueChangeHandler('firstName')}/>
                    <TextField required id="last-name" label="Last Name" variant="outlined" 
                               disabled={!edit}
                               defaultValue={providerDetails.lastName} 
                               onChange={providerDetails.valueChangeHandler('lastName')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <StateSelect defaultValue={providerDetails.state} 
                               disabled={!edit}
                               onChange={providerDetails.valueChangeHandler('state')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <FormControlLabel label="Available for referrals" control={
                      <Switch
                        disabled={!edit}
                        checked={providerDetails.available}
                        onChange={handleCheck}
                        name="available"
                        color="secondary"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={8} align="left">
                  <RateSelect defaultValue={providerDetails.rate} 
                              disabled={!edit}
                              onChange={providerDetails.valueChangeHandler('rate')}/>
                    
                </Grid>
                <Grid item xs={6} align="center">
                  {edit && <Button variant="contained" color="primary" type="submit">Submit</Button>}
                </Grid>
              </Grid>
            </div>
          </form>
        </Paper>
      </Container>
      <ErrorSnackbar message={error}/>
    </div>
  );
}

export default Edit

