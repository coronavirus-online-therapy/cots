import React, {useState, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

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



function Create(props) {
  const classes = useStyles();
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [providerDetails] = useState(new ProviderDetails());

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmit(true);
  };

  useEffect(() => {
    if(!submit) {
      return;
    }
    const createProvider = async () => {
      try {
        let response = await providerDetails.create();
        if(props.onCreate) {
          props.onCreate(response);
        }
      } catch({data, errors}) {
        setError(errors.map(e => e.message));
      }
      setSubmit(true);
    };
    createProvider();
  }, [submit, providerDetails, props]);


  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                  <Typography variant="h2" component="h2">
                    Therapist Profile
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField required id="first-name" label="First Name"  variant="outlined" onChange={providerDetails.valueChangeHandler('firstName')}/>
                    <TextField required id="last-name" label="Last Name" variant="outlined" onChange={providerDetails.valueChangeHandler('lastName')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <StateSelect onChange={providerDetails.valueChangeHandler('state')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <RateSelect onChange={providerDetails.valueChangeHandler('rate')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <FormControlLabel
                    control={<Checkbox name="licensed" color="primary" required={true}/>}
                    label="I am licensed and have liability insurance"
                  />
                  <FormControlLabel
                    control={<Checkbox name="accept" color="primary" required={true}/>}
                    label={<span>I have read and accept the <a href="https://www.coronavirusonlinetherapy.com/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a></span>}
                  />
                </Grid>
                <Grid item xs={6} align="center">
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
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

export default Create

