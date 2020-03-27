import React, { useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ErrorSnackbar(props) {
  const [open, setOpen] = useState(true);
  const handleClose= (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if(props.message && props.message.length > 0) {
    return (
      <Snackbar open={open} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {props.message}
        </Alert>
      </Snackbar>
    )
  }
  return (<div/>);
}

export default ErrorSnackbar;
