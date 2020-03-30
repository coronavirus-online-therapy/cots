import React, {useState, useEffect}  from 'react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';


import Referral from './Referral';
import ProviderList from './List';
import StateSelect from '../common/StateSelect';
import RateSelect from '../common/RateSelect';
import InsuranceInput from '../common/InsuranceInput';
import GenderSelect from '../common/GenderSelect';
import LanguagesInput from '../common/LanguagesInput';
import ModalityInput from '../common/ModalityInput';
import SpecializationInput from '../common/SpecializationInput';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    margin: theme.spacing(3),
  },
  divider:{
    margin: theme.spacing(3),
  },
  search:{
    margin: theme.spacing(1),
  }
}));


function App() {
  const classes = useStyles();
  const [query, setQuery] = useState({});
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    if(!query.state) {
      setProviders(null);
      return;
    }
    new Referral(query).execute().then(setProviders);
  }, [query, setProviders]);

  return (
    <Container maxWidth="md">
      <Paper className={classes.root}>
        <Typography variant="h2" component="h2" className={classes.title}>
          Request a Therapist 
        </Typography>
        <Typography variant="h5" component="h5">
          IF YOU ARE FEELING SUICIDAL, PLEASE CALL 911 
        </Typography>
        <Typography>
          or The National Suicide Hotline:  1-800-273-8255  
        </Typography>
        <Container maxWidth="sm" align="justify">
          <br/>
          We are not equipped to assist in emergencies.  Online therapy is not appropriate for anyone in this situation, and we cannot match you with an online therapist if you are feeling suicidal.
        </Container>
        <Divider className={classes.divider}/>
        <Container className={classes.search}>
          <ProviderQuery onChange={setQuery}/>
          <ProviderList providers={providers}/>
        </Container> 
      </Paper>
    </Container>
  );
}

function ProviderQuery(props) {
  const classes = useStyles();
  const [query, setQuery] = useState({});

  const handleChange = field => {
    return (event, value) => {
      const newQuery = {...query};
      if(value !== undefined) {
        newQuery[field] = value;
      } else if (event.target !== undefined) {
        newQuery[field] = event.target.value;
      } else {
        newQuery[field] = event;
      }
      setQuery(newQuery);
    }
  };
  const handleSearch = () => {
    if(props.onChange) {
      props.onChange(query);
    }
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={5} align="left">
          <Grid container spacing={0}>
            <Grid item xs={12} align="left" className={classes.search}>
              <StateSelect onChange={handleChange('state')}/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <InsuranceInput max={1} 
                              onChange={handleChange('acceptedInsurance')}
                              label='Health Insurance' 
                              helperText='Optional: only enter if you have insurance available'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <GenderSelect onChange={handleChange('gender')}
                            label='Preferred Gender' 
                            helperText='Optional: choose the preferred gender of a therapist'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <SpecializationInput onChange={handleChange('specializations')}
                                   helperText='Optional: choose preferred specialties of a therapist'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <ModalityInput onChange={handleChange('modalities')}
                             helperText='Optional: choose preferred types of therapy'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <LanguagesInput onChange={handleChange('languages')}
                              helperText='Optional: choose preferred languages spoken'/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={0}>
            <Grid item xs={12} align="left" className={classes.search}>
              <RateSelect onChange={handleChange('rate')} label='Highest fee I can afford at this time is:'/>
            </Grid>
            <Grid item xs={12} align="center" className={classes.search}>
              <Button variant="contained" color="primary" type="submit" onClick={handleSearch}><SearchIcon/> Search</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
