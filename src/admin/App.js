import React from 'react';
import clsx from 'clsx';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EditIcon from '@material-ui/icons/Edit';
import VerifyIcon from '@material-ui/icons/VerifiedUser';
import ExportIcon from '@material-ui/icons/ImportExport';
import StatsIcon from '@material-ui/icons/Equalizer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ProviderAuth from '../providers/Auth';
import EditTherapist from './EditTherapist';
import VerifyTherapists from './VerifyTherapists';
import Stats from './Stats';
import Export from './Export';
import { ConfirmSignIn, 
         Loading,
         RequireNewPassword, 
         TOTPSetup,
         VerifyContact, 
         Authenticator } from 'aws-amplify-react';
import { datadogLogs } from '@datadog/browser-logs'

const drawerWidth = 240;
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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  }
}));


function Denied() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          <Alert severity="error" variant="filled">Access Denied!</Alert>
        </Paper>
      </Container>
    </div>
  );
}
function AdminMain() {
  const classes = useStyles();
  const [adminAction, setAdminAction] = React.useState(EditTherapist);
  return (
    <div className={classes.root}>
      <AdminDrawer onAdminActionChange={setAdminAction}/>
      <Container maxWidth="md">
        <Paper style={{ margin: 16}}>
          { adminAction } 
        </Paper>
      </Container>
    </div>
  );
}

function AdminDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const defaultOpen = useMediaQuery(theme.breakpoints.up('sm'));
  if(defaultOpen && !open) { 
    setOpen(true);
  }

  const changeAdminAction = (action) => {
    return () => {
      if(props.onAdminActionChange !== undefined) {
        props.onAdminActionChange(action)
      }
    }
  }

  const content = (
    <div>
      <IconButton onClick={toggleDrawer} align="right">
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
      <Divider />
      <List>
        <ListItem button key='Edit Therapist' onClick={changeAdminAction(EditTherapist)}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText primary='Edit Therapist' />
        </ListItem>
        <ListItem button key='Verify Therapists' onClick={changeAdminAction(VerifyTherapists)}>
          <ListItemIcon><VerifyIcon /></ListItemIcon>
          <ListItemText primary='Verify Therapists' />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key='Stats' onClick={changeAdminAction(Stats)}>
          <ListItemIcon><StatsIcon /></ListItemIcon>
          <ListItemText primary='Stats' />
        </ListItem>
        <ListItem button key='Export' onClick={changeAdminAction(Export)}>
          <ListItemIcon><ExportIcon /></ListItemIcon>
          <ListItemText primary='Export' />
        </ListItem>
      </List>
    </div>
  );
  return (        
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Drawer
        variant="permanent"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        {content}
      </Drawer>
    </nav>
  );

}

function App(props) {
  if(props.authData) {
    datadogLogs.logger.addContext('username', props.authData.username);
    datadogLogs.logger.addContext('cognitoUser', props.authData.attributes);
  }

  // Don't show anything until login is complete
  if (props.authState !== 'signedIn') {
    return null;
  } else {
    const groups = props.authData.signInUserSession.accessToken.payload["cognito:groups"]
    if (!groups.includes('admin')) {
      return Denied();
    }
    return AdminMain();
  }
}

const authTheme = {
  a: {
    color: '#648dae',
  },
  button: {
    color: '#fff',
    backgroundColor: '#648dae',
  },
  navButton: {
    color: '#fff',
    backgroundColor: '#648dae',
  }
};
function AppWithAuth() {
  return (
    <Authenticator 
      authState='signIn'
      usernameAttributes='email' 
      includeGreetings={true}
      hideDefault={true}
      theme={authTheme}
    >
      <ProviderAuth />
      <ConfirmSignIn/>
      <RequireNewPassword/>
      <VerifyContact/>
      <TOTPSetup/>
      <Loading/>
      <App/>
    </Authenticator>

  );
}

export default AppWithAuth;
