import React, {useState}  from 'react';

import { Auth } from 'aws-amplify';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from "aws-amplify-react";
import * as queries from '../graphql/queries';
import ProviderView from './View';
import ProviderCreate from './Create';

function App() {
  const [providerId, setProviderId] = useState(null);

  Auth.currentAuthenticatedUser()
    .then(user => {
      setProviderId(user.getUsername());
    })
    .catch(err => console.error(err));

  // Don't show anything until login is complete
  if(!providerId) {
    return (<div>Login required.</div>)
  }

  console.log(`providerId: ${providerId}`)
  return (
    <Connect query={graphqlOperation(queries.getProvider, {id: providerId})}>
      {({ data: {getProvider}, loading, error }) => {
        if (error) return <h3>Error</h3>;
        if (loading) return <h3>Loading...</h3>;
        if (!getProvider) return (<ProviderCreate />);
        return (<ProviderView provider={getProvider}/>);
      }}
    </Connect>
  );
}

export default App
