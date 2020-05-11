import React from 'react';
import Grid from '@material-ui/core/Grid';

function UserInfo(props) {
  const [user] = React.useState(props.user);
  const getAttribute = (attr) => {
    return user.UserAttributes.filter(a => a.Name === attr).map(a => a.Value)[0];
  };

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={6}>
        Status <b>{user.Enabled===true?'ENABLED':'DISABLED'}</b> &amp; <b>{user.UserStatus}</b>
      </Grid>
      <Grid item xs={6}>
        Email <b>{getAttribute('email_verified') === 'true'?'VERIFIED':'UNVERIFIED'}</b>
      </Grid>
    </Grid>
  )
}

export default UserInfo;
