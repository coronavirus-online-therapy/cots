import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { datadogLogs } from '@datadog/browser-logs'
datadogLogs.init({
  clientToken: 'pub0148163baf468a253c412a931378e543',
  datacenter: 'us',
  forwardErrorsToLogs: true,
  sampleRate: 100
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
