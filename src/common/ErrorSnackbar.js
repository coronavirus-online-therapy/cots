import React, { useState, useEffect } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ErrorSnackbar(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(props.message !== '') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [props, setOpen]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {props.message.toString()}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackbar;
