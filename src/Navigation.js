import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { Hub, Auth } from "aws-amplify";
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({

  root: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    //flexGrow: 1,
    color: 'grey',
    margin: theme.spacing(2),
  },
  appbar: {
    alignItems: 'center',
  },
  signout: {
    position: 'absolute',
    right: '0px',
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
  }
}));

const links=[
  {
    label: 'Welcome',
    href: 'https://www.coronavirusonlinetherapy.com/'
  },
  {
    label: 'Who We Serve',
    href: 'https://www.coronavirusonlinetherapy.com/who-we-serve'
  },
  {
    label: 'Request A Therapist',
    href: '/',
  },
  {
    label: 'Join Us',
    href: '/providers'
  },
  {
    label: 'Resources',
    href: 'https://www.coronavirusonlinetherapy.com/resources',
  },
  {
    label: 'About Us',
    href: 'https://www.coronavirusonlinetherapy.com/about-the-founder',
  },
  {
    label: 'Blog',
    href: 'https://www.coronavirusonlinetherapy.com/blog',
  },
  {
    label: 'FAQ',
    href: 'https://www.coronavirusonlinetherapy.com/faq',
  },
  {
    label: 'Contact',
    href: 'https://www.coronavirusonlinetherapy.com/contact',
  },
];


export default function Navigation() {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [drawerState, setDrawerState] = useState(false);

  useEffect(() => {
    if(user === null) {
      Auth.currentAuthenticatedUser()
        .then(u => { setUser(u) })
        .catch(err => console.log(err));
    }
  }, [user, setUser]);

  const doSignOut = () => {
    Auth.signOut().catch(err => console.error(err));
  };
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerState(open);
  };

  Hub.listen('auth', ({payload}) => {
    if(payload.event === 'signOut') {
      setUser(null);
    } else if (payload.event === 'signIn') {
      setUser(payload.data);
    }
  });

  return (
    <div className={classes.root}>
      <Hidden xsDown>
        <AppBar position="fixed" className={classes.appbar} color="default">
          <Toolbar>
              {links.map(link => (
                <Link key={link.label} className={classes.title} href={link.href}>{link.label}</Link>
              ))}
          </Toolbar>
          {user && 
            <Button variant="contained" color="primary" className={classes.signout} onClick={doSignOut}>SIGN OUT</Button>
            }
        </AppBar>
      </Hidden>
      <Hidden smUp>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={drawerState} onClose={toggleDrawer(false)}>
          <List>
            {links.map(link => (
              <ListItem button component="a" href={link.href}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            {user && 
              <ListItem button>
                <ListItemText primary="SIGN OUT" onClick={doSignOut}/>
              </ListItem>
            }
          </List>
        </Drawer>
      </Hidden>
      <Toolbar />
    </div>
  );
}
