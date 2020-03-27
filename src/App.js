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


Amplify.configure(awsconfig);

function App() {
  return (
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
  );
}
export default App;
