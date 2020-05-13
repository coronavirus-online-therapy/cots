import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { Auth, API, graphqlOperation } from 'aws-amplify';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function ConfirmDialog(props) {
  return (
    <div>
      <Dialog
        open={true}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={props.onConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function UserInfo(props) {
  const [error, setError] = React.useState('');
  const [confirm, setConfirm] = React.useState(false);
  const [user] = React.useState(props.user);
  const getAttribute = (attr) => {
    return user.UserAttributes.filter(a => a.Name === attr).map(a => a.Value)[0];
  };

  const confirmDelete = () => {
    setConfirm(true);
  }
  const doCancel = () => {
    setConfirm(false);
  }
  const doDelete = async () => {
    setConfirm(false);
    setError('');

    try {
      // load provider (with access points)
      const {data: {getProvider}} = await API.graphql(graphqlOperation(getProviderAccessPoints, {owner: user.Username}));

      if(getProvider !== null) {
        // delete access points
        for(let ap of getProvider.accessPoints.items) {
          await API.graphql(graphqlOperation(deleteProviderAccessPoint, {owner: user.Username, state: ap.state}));
        }

        // delete provider
        await API.graphql(graphqlOperation(deleteProvider, {owner: user.Username}));
      }

      // delete user
      await API.post('AdminQueries', '/deleteUser', 
        {
          body: {username: user.Username},
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          } 
        }
      );
      props.onChange();
    } catch (e) {
      if (e.response !== undefined && e.response !== null) {
        setError(e.response.data.message)
      } else {
        setError(e.message);
      }
    }

  }
  const doConfirm = async () => {
    setError('');

    try {
      // confirm user
      await API.post('AdminQueries', '/confirmUserSignUp', 
        {
          body: {username: user.Username},
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          } 
        }
      );
      props.onChange();
    } catch (e) {
      if (e.response !== undefined && e.response !== null) {
        setError(e.response.data.message)
      } else {
        setError(e.message);
      }
    }
  }

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={4}>
        Status <b>{user.Enabled===true?'ENABLED':'DISABLED'}</b> &amp; <b>{user.UserStatus}</b>
      </Grid>
      <Grid item xs={2}>
        {user.UserStatus !== 'CONFIRMED' && <Button variant="contained" color="secondary" onClick={doConfirm}>Confirm</Button>}
      </Grid>
      <Grid item xs={4}>
        Email <b>{getAttribute('email_verified') === 'true'?'VERIFIED':'UNVERIFIED'}</b>
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" color="secondary" onClick={confirmDelete}>Delete</Button>
        {confirm && <ConfirmDialog onCancel={doCancel} onConfirm={doDelete} title="Confirm Therapist Deletion" description="Are you sure you want to delete this therapist?"/>}
      </Grid>
      <Grid item xs={12}>
        {error && <Alert severity="error" variant="filled">{error}</Alert>}
      </Grid>
    </Grid>
  )
}

export default UserInfo;

const getProviderAccessPoints = /* GraphQL */ `
  query GetProvider($owner: String!) {
    getProvider(owner: $owner) {
      owner
      accessPoints {
        items {
          state
        }
      }
    }
  }
`;

const deleteProviderAccessPoint = /* GraphQL */ `
  mutation DeleteProviderAccessPoints($owner: String!, $state: String!) {
    deleteAccessPoint(input: {owner: $owner, state: $state}) {
      owner
    }
  }
`;

const deleteProvider = /* GraphQL */ `
  mutation DeleteProvider(
    $owner: String!
  ) {
    deleteProvider(input: {owner: $owner}) {
      owner
    }
  }
`;
