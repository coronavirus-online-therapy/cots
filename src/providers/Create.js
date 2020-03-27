import React, {useState, useEffect} from 'react';

import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from '../graphql/mutations';
import { Typography, Grid, Container, Paper, TextField, FormControlLabel, Checkbox, FormControl, FormLabel, RadioGroup, Radio, Button, InputLabel, Select}  from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import States from './States';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Create(props) {
  const classes = useStyles();
  const [rate, setRate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState(false);

  const handleRateChange = event => {
    setRate(event.target.value);
  };
  const handleFirstNameChange = event => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = event => {
    setLastName(event.target.value);
  };
  const handleStateChange = event => {
    setState(event.target.value);
  };


  const [providerDetails, setProviderDetails] = useState(undefined);
  const handleSubmit = (e) => {
    e.preventDefault()

    setProviderDetails({
      firstName,
      lastName,
      rate: parseInt(rate),
      state,
      available: true,
    });
  };

  useEffect(() => {
    if(providerDetails === undefined) {
      return;
    }
    const createProvider = async () => {
      let user = await Auth.currentAuthenticatedUser();
      providerDetails.owner = user.getUsername();
      try {
        let response = await API.graphql(graphqlOperation(mutations.createProvider, {input: providerDetails}));
        if(props.onCreate) {
          props.onCreate(response);
        }
      } catch({data, errors}) {
        let errList = errors.map(e => e.message);
        console.error(errList)
        setError(errList);
      }
    };
    createProvider();
  }, [providerDetails, props]);

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError("");
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                  <Typography variant="h2" component="h2">
                    Therapist Setup
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField required id="first-name" label="First Name"  variant="outlined" value={firstName} onChange={handleFirstNameChange}/>
                    <TextField required id="last-name" label="Last Name" variant="outlined" value={lastName} onChange={handleLastNameChange}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <FormControl variant="outlined" className={classes.formControl} required>
                    <InputLabel htmlFor="state-select">
                      State
                    </InputLabel>
                    <Select
                      native
                      value={state}
                      required
                      label="State"
                      onChange={handleStateChange}
                      inputProps={{
                        name: 'state',
                        id: 'state-select',
                      }}
                    >
                      <option value="" />
                      {States.map(state => <option key={state.Code} value={state.Code}>{state.State}</option>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8} align="left">
                  <FormControl component="fieldset"> 
                    <FormLabel component="legend">I would be willing to offer sessions:</FormLabel>
                    <RadioGroup aria-label="rate" name="rate" value={rate} onChange={handleRateChange}>
                      <FormControlLabel value="0" control={<Radio required={true}/>} label="Pro-bono/free" />
                      <FormControlLabel value="15" control={<Radio required={true}/>} label="For $15/session" />
                      <FormControlLabel value="25" control={<Radio required={true}/>} label="For $25/session" />
                      <FormControlLabel value="50" control={<Radio required={true}/>} label="For $50/session" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={8} align="left">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="licensed"
                        color="primary"
                        required={true}
                      />
                    }
                    label="I am licensed and have liability insurance"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="accept"
                        color="primary"
                        required={true}
                      />
                    }
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
      <Snackbar open={error.length > 0} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Create

