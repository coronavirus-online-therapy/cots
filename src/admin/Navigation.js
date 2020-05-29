import React, {useState} from 'react';
import clsx from 'clsx';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Auth } from "aws-amplify";
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EditIcon from '@material-ui/icons/Edit';
import VerifyIcon from '@material-ui/icons/VerifiedUser';
import ExpiredIcon from '@material-ui/icons/EventBusy';
import ExportIcon from '@material-ui/icons/ImportExport';
import StatsIcon from '@material-ui/icons/Equalizer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import EditTherapist from './EditTherapist';
import VerifyTherapists from './VerifyTherapists';
import ExpiredTherapists from './ExpiredTherapists';
import Stats from './Stats';
import Export from './Export';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({

  root: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  title: {
    //flexGrow: 1,
    color: 'grey',
    margin: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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

function AdminDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const changeAdminAction = (action) => {
    return () => {
      if(props.onAdminActionChange !== undefined) {
        props.onAdminActionChange(action)
      }
    }
  }

  const doSignOut = () => {
    Auth.signOut().catch(err => console.error(err));
  };

  const content = (
    <div>
      <IconButton onClick={props.onCollapse} align="right">
        {props.expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
      <Divider />
      <List>
        <ListItem button key='Edit Therapist' onClick={changeAdminAction(<EditTherapist/>)}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText primary='Edit Therapist' />
        </ListItem>
        <ListItem button key='Verify Therapists' onClick={changeAdminAction(<VerifyTherapists/>)}>
          <ListItemIcon><VerifyIcon /></ListItemIcon>
          <ListItemText primary='Verify Therapists' />
        </ListItem>
        <ListItem button key='Expired Therapists' onClick={changeAdminAction(<ExpiredTherapists/>)}>
          <ListItemIcon><ExpiredIcon /></ListItemIcon>
          <ListItemText primary='Expired Therapists' />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key='Stats' onClick={changeAdminAction(<Stats/>)}>
          <ListItemIcon><StatsIcon /></ListItemIcon>
          <ListItemText primary='Stats' />
        </ListItem>
        <ListItem button key='Export' onClick={changeAdminAction(<Export/>)}>
          <ListItemIcon><ExportIcon /></ListItemIcon>
          <ListItemText primary='Export' />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key='Sign out' onClick={doSignOut}>
          <ListItemIcon><SignOutIcon /></ListItemIcon>
          <ListItemText primary='Sign Out' />
        </ListItem>
      </List>
    </div>
  );
  return (        
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Drawer
        variant="permanent"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={props.expanded} 
        onClose={props.onCollapse}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: props.expanded,
          [classes.drawerClose]: !props.expanded,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: props.expanded,
            [classes.drawerClose]: !props.expanded,
          }),
        }}
      >
        {content}
      </Drawer>
    </nav>
  );

}

export default function Navigation(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [drawerExpanded, setDrawerExpanded] = useState();

  const defaultExpanded = useMediaQuery(theme.breakpoints.up('sm'));
  if(drawerExpanded === undefined && defaultExpanded) {
    setDrawerExpanded(true);
  }

  const setExpanded = (expanded) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerExpanded(expanded);
  };

  return (
    <div className={classes.root}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: drawerExpanded,
          })}
        >          
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={setExpanded(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AdminDrawer onAdminActionChange={props.onAdminActionChange} expanded={drawerExpanded} onCollapse={setExpanded(false)}/>
    </div>
  );
}
