import React, {useState, useEffect}  from 'react';
import { API } from "aws-amplify";
import * as queries from '../graphql/queries';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ProviderList from './List';
import StateSelect from '../common/StateSelect';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});


function App() {
  const classes = useStyles();
  const [state, setState] = useState("");
  const [maxRate] = useState(1000);
  return (
    <Container maxWidth="md">
      <Paper className={classes.root}>
        <Typography variant="h2" component="h2">
          Therapist Search
        </Typography>
        <StateSelect onChange={setState}/>
        {state && 
          <SearchResults state={state} maxRate={maxRate}/>
         }
        </Paper>
      </Container>
  );
}
function SearchResults({state, maxRate}) {
  const limit = 100;
  const [providers, setProviders] = useState([])
  useEffect(() => {
    const runSearch = async () => {
      const {data: {itemsByState}} = await API.graphql({
        query: queries.accessPointsByState,
        variables: {state, limit },
        authMode: 'API_KEY'
      })
      setProviders(itemsByState.items)
    };
    runSearch();
  }, [setProviders, state, maxRate]);

  return (
    <ProviderList providers={providers}/>
  );
}

export default App;
