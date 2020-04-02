import React, {useState, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import EditIcon from '@material-ui/icons/Edit';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';

import TermsOfService from '../common/TermsOfService';
import AccessPoints from '../common/AccessPoints';
import AcceptTerms from '../common/AcceptTerms';
import RateSelect from '../common/RateSelect';
import GenderSelect from '../common/GenderSelect';
import InsuranceInput from '../common/InsuranceInput';
import ModalityInput from '../common/ModalityInput';
import SpecializationInput from '../common/SpecializationInput';
import LanguagesInput from '../common/LanguagesInput';
import LicenseTypeInput from '../common/LicenseTypeInput';
import ErrorSnackbar from '../common/ErrorSnackbar';
import ProviderDetails from './ProviderDetails';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));



function Profile(props) {
  const classes = useStyles();
  const [mode, setMode] = useState(props.provider.owner?'VIEW':'CREATE');
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [providerDetails, setProviderDetails] = useState(new ProviderDetails(props.provider));
  const [accessPoints, setAccessPoints] = useState((props.provider&&props.provider.accessPoints)?props.provider.accessPoints.items:[]);
  const [confirmMessage, setConfirmMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmit(true);
  };

  useEffect(() => {
    if(!submit) {
      return;
    }
    setSubmit(false);

    const doAccessPoints = async () => {
      for (let ap of accessPoints) {
        if(ap.operation === 'ADD') {
          await providerDetails.addAccessPoint(ap.accessPoint);
        } else if(ap.operation === 'UPDATE') {
          await providerDetails.updateAccessPoint(ap.accessPoint);
        } else if(ap.operation === 'DELETE') {
          await providerDetails.deleteAccessPoint(ap.accessPoint);
        }
     }
    }

    const doSubmit = async () => {
      try {
        let response;
        if(mode === 'CREATE') {
         response = await providerDetails.create();
         await doAccessPoints();
         setConfirmMessage('Thank you.  Your profile is now live');
        } else if(mode === 'UPDATE') {
         response = await providerDetails.update();
         await doAccessPoints();
         setConfirmMessage('Thank you.  Your profile has been updated.');
        }
        
        if(props.onChange) {
          props.onChange(response);
        }
        setMode('VIEW');
      } catch(err) {
        console.error(err);
        if(err.errors) {
          setError(err.errors.map(e => e.message));
        } else {
          setError(err);
        }
      }
    };

    doSubmit();
  }, [submit, providerDetails, props, accessPoints, mode]);

  const handleChange = field => {
    return (event, value, reason) => {
      let pd = new ProviderDetails(providerDetails);
      if(value !== undefined) {
        pd[field] = value;
      } else if (event.target !== undefined) {
        pd[field] = event.target.value;
      } else {
        pd[field] = event;
      }
      setProviderDetails(pd);
    };
  };

  const handleCheck = event => {
    let pd = new ProviderDetails(providerDetails);
    pd[event.target.name] = event.target.checked;
    setProviderDetails(pd);
  };

  const handleAccessPointAdd = (value) => {
    setAccessPoints([...accessPoints, {
      operation: 'ADD',
      accessPoint: value
    }]);
  }
  const handleAccessPointUpdate = (value) => {
    setAccessPoints([...accessPoints, {
      operation: 'UPDATE',
      accessPoint: value
    }]);
  }
  const handleAccessPointDelete = (value) => {
    setAccessPoints([...accessPoints, {
      operation: 'DELETE',
      accessPoint: value
    }]);
  }

  const navigateEdit = () => {
    setSubmit(false);
    setConfirmMessage('');
    setMode('UPDATE');
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <Grid container spacing={3} justify="center">
                <Grid item xs={9}>
                  <Typography variant="h2" component="h2" align="right">
                    Therapist Profile
                  </Typography>
                </Grid>
                <Grid item xs={3}> 
                    {mode === 'VIEW' && 
                      <div>
                      <Button variant="contained" color="primary" onClick={navigateEdit}><EditIcon/></Button>
                      <div>
                      <Typography>
                        Edit
                      </Typography>
                      </div>
                      </div>
                    }
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth required id="full-name" label="Full Name"  variant="outlined" 
                               disabled={mode === 'VIEW'}
                               defaultValue={providerDetails.fullName} 
                               onChange={handleChange('fullName')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <LicenseTypeInput onChange={handleChange('licenseType')}
                                      disabled={mode === 'VIEW'}
                                      defaultValue={providerDetails.licenseType} 
                    />
                </Grid>
                <Grid item xs={8} align="left">
                    <AccessPoints onAdd={handleAccessPointAdd} onUpdate={handleAccessPointUpdate} onDelete={handleAccessPointDelete}
                                      disabled={mode === 'VIEW'}
                                      defaultValue={accessPoints} 
                    />
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth required id="liability-policy" label="Liability Policy #"  variant="outlined" 
                               disabled={mode === 'VIEW'}
                               defaultValue={providerDetails.liabilityPolicy} 
                               onChange={handleChange('liabilityPolicy')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth id="phone" label="Phone #"  variant="outlined" 
                               disabled={mode === 'VIEW'}
                               defaultValue={providerDetails.phone} 
                               onChange={handleChange('phone')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth id="url" label="Website"  variant="outlined"
                               disabled={mode === 'VIEW'}
                               defaultValue={providerDetails.url} 
                               onChange={handleChange('url')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  {mode !== 'CREATE' && 
                    <FormControlLabel label="Available for referrals" control={
                      <Checkbox 
                          disabled={mode === 'VIEW'}
                          checked={providerDetails.active}
                          onClick={handleCheck}
                          name="active"
                          color="primary"/>
                      } />
                  }
                </Grid>
                <Grid item xs={8} align="left">
                  <RateSelect disabled={mode === 'VIEW'}
                              defaultValue={providerDetails.rate} 
                              onChange={handleChange('rate')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <InsuranceInput max="3" 
                                    disabled={mode === 'VIEW'}
                                    defaultValue={providerDetails.acceptedInsurance} 
                                    onChange={handleChange('acceptedInsurance')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <GenderSelect disabled={mode === 'VIEW'}
                                defaultValue={providerDetails.gender} 
                                onChange={handleChange('gender')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <SpecializationInput max="3" 
                                         disabled={mode === 'VIEW'}
                                         defaultValue={providerDetails.specializations} 
                                         onChange={handleChange('specializations')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <ModalityInput max="3" 
                                   disabled={mode === 'VIEW'}
                                   defaultValue={providerDetails.modalities} 
                                   onChange={handleChange('modalities')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <LanguagesInput max="3" onChange={handleChange('languages')} 
                                    disabled={mode === 'VIEW'}
                                    defaultValue={providerDetails.languages} 
                    />
                </Grid>
                <Grid item xs={8} align="left">
                    {mode === 'CREATE' && <AcceptTerms required={true} onChange={handleChange('tosAcceptedAt')} contract={TermsOfService}/>}
                </Grid>
                <Grid item xs={6} align="center">
                  {mode !== 'VIEW' && <Button variant="contained" color="primary" type="submit">Submit</Button>}
                </Grid>
              </Grid>
            </div>
            <Backdrop className={classes.backdrop} open={submit}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </form>
        </Paper>
      </Container>
      <ConfirmSnackbar message={confirmMessage} />
      <ErrorSnackbar message={error}/>
    </div>
  );
}

function ConfirmSnackbar(props) {
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
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    >
      <Alert onClose={handleClose} severity="success">
        {props.message}
      </Alert>
    </Snackbar>
  );
}

Profile.defaultProps = {
}

export default Profile

