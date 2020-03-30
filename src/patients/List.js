import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    margin: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[300]
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  card: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(0.5),
  },
}));
export default function ListView({providers}) {
  const classes = useStyles();

  if(!providers || providers.length === 0) {
    return (<Typography variant="h4" component="h4">No matches found</Typography>);
  }

  return (
    <div className={classes.root}>
        {providers.map(provider => {return (
          <Paper key={provider.owner} className={classes.paper}>
            <div>
              <Grid container spacing={0}>
                <Grid item xs={10}>
                  <Typography variant="h4" component="h4" align="left">
                    {provider.fullName}, {provider.licenseType}
                  </Typography>
                </Grid>
                <Grid item xs={2} align="right">
                  <Box bgcolor="primary.main" color="primary.contrastText" padding={1}>
                    Session Fee:
                    <Typography variant="h5" component="h5">
                      ${provider.rate.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h5" align="left">
                    <Button color="primary" variant="contained" className={classes.button}><EmailIcon/></Button> {provider.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h5" align="left">
                    <Button color="primary" variant="contained" className={classes.button}><PhoneIcon/></Button> {formatPhoneNumber(provider.phone)}
                  </Typography>
                </Grid>
                {provider.url && 
                 <Grid item xs={12}>
                  <Typography variant="h5" component="h5" align="left">
                    <Button color="primary" variant="contained" className={classes.button}><LanguageIcon/></Button> <Link href={provider.url}>{provider.url}</Link>
                  </Typography>
                 </Grid>
                }
                {provider.acceptedInsurance && 
                 <Grid item xs={6} align="left">
                   <Card className={classes.card}>
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Insurance Plans Accepted:
                      </Typography>
                      {provider.acceptedInsurance.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                          />
                        );
                      })}
                    </CardContent>
                  </Card>
                 </Grid>
                }
                {provider.specializations && 
                 <Grid item xs={6} align="left">
                   <Card className={classes.card}>
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Therapists's Specializations:
                      </Typography>
                      {provider.specializations.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                          />
                        );
                      })}
                    </CardContent>
                  </Card>
                 </Grid>
                }
                {provider.modalities && 
                 <Grid item xs={6} align="left">
                   <Card className={classes.card}>
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Types of Therapy Offered:
                      </Typography>
                      {provider.modalities.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                          />
                        );
                      })}
                    </CardContent>
                  </Card>
                 </Grid>
                }
                {provider.languages && 
                 <Grid item xs={6} align="left">
                   <Card className={classes.card}>
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Languages Spoken:
                      </Typography>
                      {provider.languages.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                          />
                        );
                      })}
                    </CardContent>
                  </Card>
                 </Grid>
                }
              </Grid>
            </div>
          </Paper>
        )})}
    </div>
  );
}

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}
