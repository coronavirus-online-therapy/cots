import React from 'react';
import { CSVDownload } from "react-csv";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Auth, API } from 'aws-amplify';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const limit = 60;

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  }
}));

async function getAllUsers(groupName) {
  const users = [];

  let nextToken = "";
  do {
    const response = await API.get('AdminQueries', '/listUsersInGroup', 
      {
        queryStringParameters: {
          groupname: 'providers',
          limit,
          ...(nextToken && {token: nextToken}),
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        } 
      }
    );

    nextToken = response.NextToken;
    users.push(...response.Users);

  } while(nextToken !== undefined && nextToken !== "");

  return users;
}

function ExportTherapistEmail() {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const doExport = () => {
    setLoading(true);
    setData([]);
    getAllUsers('providers')
      .then(users => users.map(user => user.Attributes.filter(a => a.Name === 'email').map(a => a.Value)[0]))
      .then(emails => emails.map(email => [email]))
      .then(setData)
      .then(() => setLoading(false))
      .catch(console.error);
  }

  return (
    <div>
      <div className={classes.wrapper}>
        <Button variant="contained" onClick={doExport}>Export Therapist Email List</Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
      {data.length > 0 && <CSVDownload data={data} target="_blank" headers={['email']}/>}
    </div>
  )
}

function Export() {
  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={12}>
        <ExportTherapistEmail/>
      </Grid>
    </Grid>
  );
}

export default Export;
