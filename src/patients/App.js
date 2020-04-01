import React, {useState, useEffect}  from 'react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';


import Referral from './Referral';
import ProviderList from './List';
import AcceptTerms from '../common/AcceptTerms';
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
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}));


function App() {
  const classes = useStyles();
  const [query, setQuery] = useState({});
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    console.log(query);
    let isValid = (query.state && query.tosAcceptedAt && query.rate !== undefined);
    if(!isValid) {
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
          {providers === null && <ProviderQuery query={query} onChange={setQuery}/>}
          {providers !== null && 
            <Container>
             <Button variant="contained" color="primary" onClick={() => {setProviders(null)}}><SearchIcon/> Refine Search</Button>
             <ProviderList providers={providers}/>
            </Container>
          }
        </Container> 
      </Paper>
    </Container>
  );
}

function ProviderQuery(props) {
  const classes = useStyles();
  const [query, setQuery] = useState(props.query);
  const [loading, setLoading] = React.useState(false);

  const handleChange = field => {
    return (event, value) => {
      const newQuery = {...query};
      if(value !== undefined) {
        newQuery[field] = value===''?undefined:value;
      } else if (event.target !== undefined) {
        newQuery[field] = event.target.value===''?undefined:event.target.value;
      } else {
        newQuery[field] = event===''?undefined:event;
      }
      setQuery(newQuery);
    }
  };
  const handleSearch = () => {
    setLoading(true);
    if(props.onChange) {
      props.onChange({...query});
    }
  };
  const isQueryValid = () => {
    let isValid = (query.state && query.tosAcceptedAt && query.rate !== undefined);
    return isValid;
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={5} align="left">
          <Grid container spacing={0}>
            <Grid item xs={12} align="left" className={classes.search}>
              <StateSelect defaultValue={query.state} onChange={handleChange('state')}/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <InsuranceInput max={1} 
                              defaultValue={query.acceptedInsurance}
                              onChange={handleChange('acceptedInsurance')}
                              label='Health Insurance' 
                              helperText='Optional: only enter if you have insurance available'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <GenderSelect onChange={handleChange('gender')}
                            defaultValue={query.gender}
                            required={false}
                            label='Preferred Gender' 
                            helperText='Optional: choose the preferred gender of a therapist'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <SpecializationInput onChange={handleChange('specializations')}
                                   defaultValue={query.specializations}
                                   helperText='Optional: choose preferred specialties of a therapist'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <ModalityInput onChange={handleChange('modalities')}
                             defaultValue={query.modalities}
                             helperText='Optional: choose preferred types of therapy'/>
            </Grid>
            <Grid item xs={12} align="left" className={classes.search}>
              <LanguagesInput onChange={handleChange('languages')}
                              defaultValue={query.languages}
                              helperText='Optional: choose preferred languages spoken'/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={0}>
            <Grid item xs={12} align="left" className={classes.search}>
              <RateSelect onChange={handleChange('rate')} 
                          defaultValue={query.rate}
                          label='Highest fee I can afford at this time is:'/>
            </Grid>
            <Grid item xs={12} align="center" className={classes.search}>
              <AcceptTerms required={true} 
                           defaultValue={query.tosAcceptedAt}
                           onChange={handleChange('tosAcceptedAt')} 
                           contract={contract}/>
            </Grid>
            <Grid item xs={12} align="center" className={classes.search}>
              <div className={classes.wrapper}>
                <Button variant="contained" color="primary" type="submit" disabled={!isQueryValid(query)} onClick={handleSearch}><SearchIcon/> Search</Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

const contract = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Euismod quis viverra nibh cras pulvinar mattis. Scelerisque eu ultrices vitae auctor eu augue. Molestie nunc non blandit massa enim. Felis eget nunc lobortis mattis aliquam. Enim blandit volutpat maecenas volutpat blandit aliquam. Ut morbi tincidunt augue interdum velit euismod. Donec enim diam vulputate ut pharetra. Aenean euismod elementum nisi quis eleifend quam. Mi eget mauris pharetra et ultrices. Nulla at volutpat diam ut venenatis tellus in metus. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Consequat id porta nibh venenatis cras. Enim eu turpis egestas pretium aenean pharetra magna. Augue lacus viverra vitae congue eu consequat ac felis donec. Ut eu sem integer vitae justo eget magna fermentum. Vitae et leo duis ut diam. Luctus venenatis lectus magna fringilla urna. Sed cras ornare arcu dui vivamus arcu felis bibendum ut.

Hac habitasse platea dictumst vestibulum rhoncus est. Risus nullam eget felis eget. Vel pretium lectus quam id leo in vitae turpis massa. Turpis massa tincidunt dui ut ornare. Dui nunc mattis enim ut tellus elementum sagittis. Et tortor at risus viverra adipiscing at in tellus integer. Magna sit amet purus gravida quis blandit turpis cursus. Suspendisse in est ante in nibh mauris cursus mattis. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Mattis nunc sed blandit libero volutpat sed. Lacus sed viverra tellus in. Aliquet porttitor lacus luctus accumsan. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Tortor dignissim convallis aenean et tortor at risus viverra. Viverra tellus in hac habitasse platea dictumst vestibulum. Arcu odio ut sem nulla pharetra diam sit. Tortor id aliquet lectus proin nibh nisl condimentum id.

Nibh sit amet commodo nulla facilisi nullam vehicula ipsum a. Egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat. Enim praesent elementum facilisis leo. Cursus turpis massa tincidunt dui. Convallis aenean et tortor at risus viverra adipiscing at in. Cras fermentum odio eu feugiat pretium nibh ipsum consequat. Pretium nibh ipsum consequat nisl vel. Nam at lectus urna duis convallis convallis tellus id. Egestas congue quisque egestas diam in arcu cursus euismod quis. Tellus mauris a diam maecenas sed.

Enim praesent elementum facilisis leo vel fringilla est ullamcorper eget. Tempor orci dapibus ultrices in. Purus viverra accumsan in nisl nisi scelerisque eu ultrices. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. Mauris cursus mattis molestie a iaculis at erat pellentesque. Tincidunt vitae semper quis lectus nulla. Augue mauris augue neque gravida in fermentum et sollicitudin ac. Pretium lectus quam id leo. Vivamus at augue eget arcu dictum varius duis. Auctor urna nunc id cursus metus aliquam eleifend mi. Nulla aliquet porttitor lacus luctus accumsan tortor. Adipiscing enim eu turpis egestas pretium aenean pharetra magna.

Lacus viverra vitae congue eu consequat ac felis donec et. Egestas purus viverra accumsan in nisl. Hendrerit gravida rutrum quisque non tellus orci ac auctor augue. Mi sit amet mauris commodo quis imperdiet massa. Blandit turpis cursus in hac habitasse platea dictumst. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo. Habitant morbi tristique senectus et netus et malesuada fames. Fermentum leo vel orci porta. Purus in mollis nunc sed id. Libero nunc consequat interdum varius. Ultrices sagittis orci a scelerisque purus semper eget duis at. Massa id neque aliquam vestibulum morbi. Duis at tellus at urna. Eu volutpat odio facilisis mauris. Fermentum dui faucibus in ornare quam viverra orci. Enim ut tellus elementum sagittis vitae et. Ornare quam viverra orci sagittis.
`;
