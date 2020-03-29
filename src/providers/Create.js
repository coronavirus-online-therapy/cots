import React, {useState, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

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
}));



function Create(props) {
  const classes = useStyles();
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [providerDetails, setProviderDetails] = useState(new ProviderDetails());

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmit(true);
  };

  useEffect(() => {
    if(!submit) {
      return;
    }
    const createProvider = async () => {
      try {
        let response = await providerDetails.create();
        if(props.onCreate) {
          props.onCreate(response);
        }
      } catch({data, errors}) {
        setError(errors.map(e => e.message));
      }
      setSubmit(false);
    };
    createProvider();
  }, [submit, providerDetails, props]);

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
      console.log(pd);
    };
  };

  const handleAccessPoints = (value) => {
    console.log(value);
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                  <Typography variant="h2" component="h2">
                    Therapist Profile
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth required id="full-name" label="Full Name"  variant="outlined" onChange={handleChange('fullName')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <LanguagesInput max="3" onChange={handleChange('languages')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <LicenseTypeInput onChange={handleChange('licenseType')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <AccessPoints onChange={handleAccessPoints}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth required id="liability-policy" label="Liability Policy #"  variant="outlined" onChange={handleChange('liabilityPolicy')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth id="phone" label="Phone #"  variant="outlined" onChange={handleChange('phone')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <TextField fullWidth id="url" label="Website"  variant="outlined" onChange={handleChange('url')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <RateSelect onChange={handleChange('rate')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <InsuranceInput max="3" onChange={handleChange('acceptedInsurance')}/>
                </Grid>
                <Grid item xs={8} align="left">
                  <GenderSelect onChange={handleChange('gender')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <SpecializationInput max="3" onChange={handleChange('specializations')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <ModalityInput max="3" onChange={handleChange('modalities')}/>
                </Grid>
                <Grid item xs={8} align="left">
                    <AcceptTerms required={true} onChange={handleChange('tosAcceptedAt')} contract={contract}/>
                </Grid>
                <Grid item xs={6} align="center">
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </div>
          </form>
        </Paper>
      </Container>
      <ErrorSnackbar message={error}/>
    </div>
  );
}

const contract = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Euismod quis viverra nibh cras pulvinar mattis. Scelerisque eu ultrices vitae auctor eu augue. Molestie nunc non blandit massa enim. Felis eget nunc lobortis mattis aliquam. Enim blandit volutpat maecenas volutpat blandit aliquam. Ut morbi tincidunt augue interdum velit euismod. Donec enim diam vulputate ut pharetra. Aenean euismod elementum nisi quis eleifend quam. Mi eget mauris pharetra et ultrices. Nulla at volutpat diam ut venenatis tellus in metus. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Consequat id porta nibh venenatis cras. Enim eu turpis egestas pretium aenean pharetra magna. Augue lacus viverra vitae congue eu consequat ac felis donec. Ut eu sem integer vitae justo eget magna fermentum. Vitae et leo duis ut diam. Luctus venenatis lectus magna fringilla urna. Sed cras ornare arcu dui vivamus arcu felis bibendum ut.

Hac habitasse platea dictumst vestibulum rhoncus est. Risus nullam eget felis eget. Vel pretium lectus quam id leo in vitae turpis massa. Turpis massa tincidunt dui ut ornare. Dui nunc mattis enim ut tellus elementum sagittis. Et tortor at risus viverra adipiscing at in tellus integer. Magna sit amet purus gravida quis blandit turpis cursus. Suspendisse in est ante in nibh mauris cursus mattis. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Mattis nunc sed blandit libero volutpat sed. Lacus sed viverra tellus in. Aliquet porttitor lacus luctus accumsan. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Tortor dignissim convallis aenean et tortor at risus viverra. Viverra tellus in hac habitasse platea dictumst vestibulum. Arcu odio ut sem nulla pharetra diam sit. Tortor id aliquet lectus proin nibh nisl condimentum id.

Nibh sit amet commodo nulla facilisi nullam vehicula ipsum a. Egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat. Enim praesent elementum facilisis leo. Cursus turpis massa tincidunt dui. Convallis aenean et tortor at risus viverra adipiscing at in. Cras fermentum odio eu feugiat pretium nibh ipsum consequat. Pretium nibh ipsum consequat nisl vel. Nam at lectus urna duis convallis convallis tellus id. Egestas congue quisque egestas diam in arcu cursus euismod quis. Tellus mauris a diam maecenas sed.

Enim praesent elementum facilisis leo vel fringilla est ullamcorper eget. Tempor orci dapibus ultrices in. Purus viverra accumsan in nisl nisi scelerisque eu ultrices. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. Mauris cursus mattis molestie a iaculis at erat pellentesque. Tincidunt vitae semper quis lectus nulla. Augue mauris augue neque gravida in fermentum et sollicitudin ac. Pretium lectus quam id leo. Vivamus at augue eget arcu dictum varius duis. Auctor urna nunc id cursus metus aliquam eleifend mi. Nulla aliquet porttitor lacus luctus accumsan tortor. Adipiscing enim eu turpis egestas pretium aenean pharetra magna.

Lacus viverra vitae congue eu consequat ac felis donec et. Egestas purus viverra accumsan in nisl. Hendrerit gravida rutrum quisque non tellus orci ac auctor augue. Mi sit amet mauris commodo quis imperdiet massa. Blandit turpis cursus in hac habitasse platea dictumst. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo. Habitant morbi tristique senectus et netus et malesuada fames. Fermentum leo vel orci porta. Purus in mollis nunc sed id. Libero nunc consequat interdum varius. Ultrices sagittis orci a scelerisque purus semper eget duis at. Massa id neque aliquam vestibulum morbi. Duis at tellus at urna. Eu volutpat odio facilisis mauris. Fermentum dui faucibus in ornare quam viverra orci. Enim ut tellus elementum sagittis vitae et. Ornare quam viverra orci sagittis.
`;

export default Create

