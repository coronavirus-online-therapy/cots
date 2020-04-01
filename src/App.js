import React from 'react';
import './App.css';

import Amplify  from 'aws-amplify';
import awsconfig from './aws-exports';

import ProviderApp from './providers/App';
import PatientApp from './patients/App';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#648dae'
    } 
  },
  overrides: {
    MuiContainer: {
      root: {
        paddingLeft: 3,
        paddingRight: 3,
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: '0.7rem',
      }
    }
  },
});
theme = responsiveFontSizes(theme, {factor: 10});
theme.overrides.MuiInputLabel.root = {
  [theme.breakpoints.up('md')]: {
    fontSize: '1.0rem',
  },
};

Amplify.configure(awsconfig);

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">

        <Router>
          <Switch>
            <Route path="/providers">
              <ProviderApp />
            </Route>
            <Route path="/">
              <PatientApp />
            </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}
export default App;
