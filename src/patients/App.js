import React, {useState}  from 'react';

import { graphqlOperation } from 'aws-amplify';
import { Connect } from "aws-amplify-react";
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
  return (
    <Connect query={graphqlOperation(queries.itemsByState, {state, filter: {available: {eq: true}, rate: {le: maxRate}}, limit })}> 
      {({ data: {itemsByState}, loading, error }) => {
        if (error) return <h3>Error</h3>;
        if (loading) return <h3>Loading...</h3>;
        return (<ProviderList providers={shuffle(itemsByState.items)} />);
      }}
    </Connect>
  );
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default App;
