import React from 'react';

import { Paper }  from '@material-ui/core';

function View(props) {
  const provider = props.provider

  return (
    <Paper style={{ margin: 16}}>
      <p>{provider.name}</p>
    </Paper>
  );
}

export default View
