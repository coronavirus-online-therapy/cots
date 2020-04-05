import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Hub, Auth } from "aws-amplify";

const useStyles = makeStyles(theme => ({

  root: {
    flexGrow: 1,
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
    href: '/'
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

  Hub.listen('auth', ({payload}) => {
    if(payload.event === 'signOut') {
      setUser(null);
    } else if (payload.event === 'signIn') {
      setUser(payload.data);
    }
  });

  return (
    <div className={classes.root}>
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
      <Toolbar />
    </div>
  );
}
