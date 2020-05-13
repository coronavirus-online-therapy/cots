import React from 'react';
import './App.css';

import Amplify  from 'aws-amplify';
import awsconfig from './aws-exports';

import Navigation from './Navigation';
import ProviderApp from './providers/App';
import AdminApp from './admin/App';
import PatientApp from './patients/App';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';

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

const useStyles = makeStyles(theme => ({
}));

Amplify.configure(awsconfig);

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className={classes.offset}>
          <Router>
            <Switch>
              <Route path="/admin">
                <AdminApp />
              </Route>
              <Route path="/providers">
                yy<Navigation/>
                <ProviderApp />
              </Route>
              <Route path="/">
                <Navigation/>
                <PatientApp />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </ThemeProvider>
  );
}
export default App;
