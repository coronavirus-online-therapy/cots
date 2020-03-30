import React, {useState, useEffect}  from 'react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Referral from './Referral';
import ProviderList from './List';
import StateSelect from '../common/StateSelect';
import RateSelect from '../common/RateSelect';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});


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
        <Typography variant="h2" component="h2">
          Therapist Referral
        </Typography>
        <ProviderQuery onChange={setQuery}/>
        <ProviderList providers={providers}/>
      </Paper>
    </Container>
  );
}

function ProviderQuery(props) {
  const [query, setQuery] = useState({});

  const handleChange = field => {
    return val => {
      const newQuery = {...query};
      newQuery[field] = val;
      setQuery(newQuery);
      if(props.onChange) {
        props.onChange(newQuery);
      }
    }
  };
  return (
    <Container>
      <StateSelect onChange={handleChange('state')}/>
      <RateSelect onChange={handleChange('rate')} label='Highest fee I can afford at this time is:'/>
    </Container>
  );
}

export default App;
