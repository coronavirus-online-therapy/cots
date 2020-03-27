import React from 'react';

import { Typography, Grid, Container, Paper, TextField, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio, Button, InputLabel, Select}  from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import States from './States'

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

function View(props) {
  const provider = props.provider
  const classes = useStyles();

  console.log(provider)

  return (
    <Container maxWidth="md">
      <Paper style={{ margin: 16}}>
          <form className={classes.root} autoComplete="off">
            <div>
            <Grid container spacing={3} justify="center">
              <Grid item xs={12}>
                <Typography variant="h2" component="h2">
                  Therapist View
                </Typography>
              </Grid>
              <Grid item xs={8} align="left">
                  <TextField required id="first-name" label="First Name"  variant="outlined" defaultValue={provider.firstName} disabled/>
                  <TextField required id="last-name" label="Last Name" variant="outlined" defaultValue={provider.lastName} disabled/>
              </Grid>
              <Grid item xs={8} align="left">
                <FormControl variant="outlined" className={classes.formControl} required>
                  <InputLabel htmlFor="state-select">
                    State
                  </InputLabel>
                  <Select
                    native
                    disabled
                    defaultValue={provider.state}
                    required
                    label="State"
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
                  <RadioGroup aria-label="rate" name="rate" defaultValue={provider.rate.toString()} >
                    <FormControlLabel value="0" control={<Radio required={true}/>} label="Pro-bono/free" disabled/>
                    <FormControlLabel value="15" control={<Radio required={true}/>} label="For $15/session" disabled/>
                    <FormControlLabel value="25" control={<Radio required={true}/>} label="For $25/session" disabled/>
                    <FormControlLabel value="50" control={<Radio required={true}/>} label="For $50/session" disabled/>
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </form>
      </Paper>
    </Container>
  );
}

export default View
