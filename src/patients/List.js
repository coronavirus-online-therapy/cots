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
import Hidden from '@material-ui/core/Hidden';
import Alert from '@material-ui/lab/Alert';


import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    margin: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[300]
  },
  chip: {
    margin: theme.spacing(0.5),
    maxWidth: '90%'
  },
  chipExpanded: {
    height: 'auto',
    minHeight: '32px',
    '& span': {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    }
  },
  card: {
    margin: theme.spacing(1),
    height: 130
  },
  button: {
    margin: theme.spacing(0.5),
  },
  feeBox: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));
export default function ListView({providers}) {
  const classes = useStyles();

  if(!providers || providers.length === 0) {
    return (<Typography variant="h4" component="h4">No matches found. Please broaden your search criteria and try again.</Typography>);
  }

  const mailtoHref = (email) => {
    return `mailto:${email}?subject=Referred by Coronavirus Online Therapy`;
  }
  const cleanUrl = (url) => {
    if (!/^(?:f|ht)tps?:\/\//.test(url)) {
      url = "http://" + url;
    }
    return url;
  }
  const expandChip= (e) => {
    let chip = e.target;
    if(!chip.classList.contains('MuiChip-root')) {
      chip = chip.parentNode;
    }
    chip.classList.add(classes.chipExpanded);
  }

  return (
    <div className={classes.root}>
        <Alert severity="info">
          PLEASE NOTE: You must let the therapist know you connected with them via Coronavirus Online Therapy, as well as tell them the fee you require. If you do not, they will quote you their full, regular fees. Thank you.
        </Alert>
        <Typography variant="h5" align="center">
          Here are your top matches based on your search criteria:
        </Typography>
        {providers.map(provider => {return (
          <Paper key={provider.owner} className={classes.paper}>
            <div>
              <Grid container spacing={0}>
                <Grid item xs={9}>
                  <Typography variant="h4" component="h4" align="left">
                    {provider.fullName}, {provider.licenseType}
                  </Typography>
                </Grid>
                <Grid item xs={3} align="right">
                  <Box className={classes.feeBox} padding={1} hidden={false}>
                    <Hidden xsDown>Accepts Fees up to $50, lowest available:</Hidden>
                    <Typography variant="h5" component="h5">
                      ${provider.rate.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                {provider.email && 
                 <Grid item xs={12}>
                  <Typography variant="h5" component="h5" align="left">
                    <Button color="primary" variant="contained" className={classes.button}><EmailIcon/></Button> <Link href={mailtoHref(provider.email)}>{provider.email}</Link>
                  </Typography>
                 </Grid>
                }
                <Grid item xs={12}>
                  <Typography variant="h5" component="h5" align="left">
                    <Button color="primary" variant="contained" className={classes.button}><PhoneIcon/></Button> {formatPhoneNumber(provider.phone)}
                  </Typography>
                </Grid>
                {provider.url && 
                 <Grid item xs={12}>
                  <Typography variant="h5" component="h5" align="left">
                    <Button color="primary" variant="contained" className={classes.button}><LanguageIcon/></Button> <Link href={cleanUrl(provider.url)} target="_blank" rel="noopener noreferrer">Webpage</Link>
                  </Typography>
                 </Grid>
                }
                {provider.acceptedInsurance && 
                 <Grid item xs={6} align="left">
                   <Card className={classes.card}>
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Insurance<Hidden xsDown> Plans Accepted</Hidden>:
                      </Typography>
                      {provider.acceptedInsurance.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                            onClick={expandChip}
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
                        <Hidden xsDown>Therapists's </Hidden>Specializations:
                      </Typography>
                      {provider.specializations.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                            onClick={expandChip}
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
                        <Hidden xsDown>Types of </Hidden>Therapy Offered:
                      </Typography>
                      {provider.modalities.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                            onClick={expandChip}
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
                        Languages<Hidden xsDown> Spoken</Hidden>:
                      </Typography>
                      {provider.languages.map((data) => {
                        return (
                          <Chip
                            key={data}
                            label={data}
                            className={classes.chip}
                            onClick={expandChip}
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
