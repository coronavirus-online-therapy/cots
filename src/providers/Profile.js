import React, {useState, useEffect} from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import ReactGA from 'react-ga';

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
import { LinearProgress } from '@material-ui/core';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providerDetails, setProviderDetails] = useState();
  const [accessPointOps, setAccessPointOps] = useState([]);
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    const doLoad = async (providerId) => {
      if(providerId === undefined || providerId === null) {
        return;
      }
      setLoading(true);
      const pd = new ProviderDetails();
      await pd.read(providerId).catch(console.error);
      if(!pd.owner && pd.active === undefined) {
        pd.active = true;
      }
      setProviderDetails(pd);
      setLoading(false);
    };

    doLoad(props.providerId);
  }, [props.providerId, setProviderDetails]);

  useEffect(() => {
    if(providerDetails === undefined) {
      return;
    }
    if(props.onLoad) {
      props.onLoad(providerDetails);
    }
  }, [props, providerDetails]);

  const saveAccessPoints = async () => {
    // validation
    const apCount = accessPointOps.reduce((apCount, ap) => {
        if(ap.operation === 'ADD') {
          return apCount + 1;
        } else if(ap.operation === 'DELETE') {
          return apCount - 1;
        }
        return apCount;
    }, providerDetails.getAccessPoints()?providerDetails.getAccessPoints().length:0);
    if(apCount === 0) {
      setLoading(false);
      setError("You must provide at least 1 state where you are licensed.");
      return;
    }

    // apply each accesspoint operation
    try {
      for (let ap of accessPointOps) {
        if(ap.operation === 'ADD') {
          await providerDetails.addAccessPoint(ap.accessPoint);
        } else if(ap.operation === 'UPDATE') {
          await providerDetails.updateAccessPoint(ap.accessPoint);
        } else if(ap.operation === 'DELETE') {
          await providerDetails.deleteAccessPoint(ap.accessPoint);
        }
      }
    } finally {
      setAccessPointOps([]);
    }
  }

  const saveProvider = async () => {
    let response;
    if(props.viewMode === true) {
      return;
    }

    if(providerDetails.owner === undefined) {
      ReactGA.event({category: 'Therapist', action: 'Create Profile'});
      providerDetails.owner = props.providerId;
      response = await providerDetails.create();
      setConfirmMessage('Thank you. Your profile is now live');
    } else {
      ReactGA.event({category: 'Therapist', action: 'Update Profile'});
      response = await providerDetails.update();
      setConfirmMessage('Thank you. Your profile has been updated.');
    }
    return response;
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("");
    setLoading(true);

    try {
      const response = await saveProvider();
      await saveAccessPoints();
      if(props.onChange) {
        props.onChange(response);
      }
    } catch(err) {
      console.error(err);
      if(err.errors) {
        const msg = err.errors.map(e => e.message);
        setError(msg);
        ReactGA.exception({description: msg})
      } else {
        setError(err);
      }
    }
    setLoading(false);
  };

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
    setError("");
    setAccessPointOps([...accessPointOps, {
      operation: 'ADD',
      accessPoint: value
    }]);
  }
  const handleAccessPointUpdate = (value) => {
    setError("");
    setAccessPointOps([...accessPointOps, {
      operation: 'UPDATE',
      accessPoint: value
    }]);
  }
  const handleAccessPointDelete = (value) => {
    setError("");
    setAccessPointOps([...accessPointOps, {
      operation: 'DELETE',
      accessPoint: value
    }]);
  }

  if(providerDetails === undefined) {
    return (<LinearProgress/>);
  } 

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <Grid container spacing={3} justify="center">
                <Grid item xs={10} align="left">
                    {!props.viewMode && providerDetails.owner === undefined &&
                        <Alert severity="warning">If you aren’t yet licensed for independent clinical practice, please stop and have the practice owner you work for complete a therapist profile instead.</Alert>
                    }
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth required id="full-name" label="Full Name"  variant="outlined" 
                               disabled={props.viewMode}
                               defaultValue={providerDetails.fullName} 
                               onChange={handleChange('fullName')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <LicenseTypeInput onChange={handleChange('licenseType')}
                                      disabled={props.viewMode}
                                      defaultValue={providerDetails.licenseType} 
                    />
                </Grid>
                <Grid item xs={8} align="left">
                    <AccessPoints onAdd={handleAccessPointAdd} onUpdate={handleAccessPointUpdate} onDelete={handleAccessPointDelete}
                                      disabled={props.viewMode}
                                      statusEditable={props.userIsAdmin}
                                      defaultValue={providerDetails.getAccessPoints()} 
                    />
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth required id="liability-policy" label="Liability Policy #"  variant="outlined" 
                               disabled={props.viewMode}
                               defaultValue={providerDetails.liabilityPolicy} 
                               onChange={handleChange('liabilityPolicy')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth id="phone" label="Office Phone #"  variant="outlined" 
                               disabled={props.viewMode}
                               defaultValue={providerDetails.phone} 
                               onChange={handleChange('phone')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth id="url" label="Website"  variant="outlined"
                               disabled={props.viewMode}
                               defaultValue={providerDetails.url} 
                               onChange={handleChange('url')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <FormControlLabel label="Available for referrals" control={
                    <Checkbox 
                        disabled={props.viewMode}
                        checked={providerDetails.active===true}
                        onClick={handleCheck}
                        name="active"
                        color="primary"/>
                    } />
                </Grid>
                <Grid item xs={8} align="left">
                  <RateSelect disabled={props.viewMode}
                              label='I agree to offer each accepted referral a minimum of four sessions.  The lowest fee I can accept at this time is:'
                              defaultValue={providerDetails.rate} 
                              onChange={handleChange('rate')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <InsuranceInput max="0" 
                                    disabled={props.viewMode}
                                    defaultValue={providerDetails.acceptedInsurance} 
                                    onChange={handleChange('acceptedInsurance')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <GenderSelect disabled={props.viewMode}
                                defaultValue={providerDetails.gender} 
                                onChange={handleChange('gender')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <SpecializationInput max="3" 
                                         disabled={props.viewMode}
                                         defaultValue={providerDetails.specializations} 
                                         onChange={handleChange('specializations')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <ModalityInput max="3" 
                                   disabled={props.viewMode}
                                   defaultValue={providerDetails.modalities} 
                                   onChange={handleChange('modalities')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <LanguagesInput max="3" onChange={handleChange('languages')} 
                                    disabled={props.viewMode}
                                    defaultValue={providerDetails.languages} 
                    />
                </Grid>
                <Grid item xs={8} align="left">
                  {!props.viewMode && providerDetails.owner === undefined &&
                    <FormControlLabel control={
                      <Checkbox color="primary" required={true}/>} label="I attest that I am licensed, insured, and authorized for clinical private practice by my state board(s)"/>
                  }
                </Grid>
                <Grid item xs={8} align="left">
                    {!props.viewMode && providerDetails.owner === undefined &&
                      <AcceptTerms required={true} onChange={handleChange('tosAcceptedAt')} contract={TermsOfService}/>}
                </Grid>
                <Grid item xs={6} align="center">
                  {!props.viewMode && <Button variant="contained" color="primary" type="submit">Submit</Button>}
                </Grid>
              </Grid>
            </div>
            <Backdrop className={classes.backdrop} open={loading}>
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

