import React from 'react';
import { Link } from "react-router-dom";
import clsx from 'clsx';
import { auth } from "../../firebaseConfig";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import PostAddIcon from '@material-ui/icons/PostAdd';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import theme from '../../theme'

import './Navbar.styles.scss';

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: '1px solid',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Navbar() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
    <div id="navbar" className={classes.root}>
      <CssBaseline />
        <AppBar
          id="AppBar"
          position="fixed"
          className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <Typography id="app-title" variant="h6" noWrap>
                Storify
            </Typography>
          </Link>
            <Button
              onClick={() => { auth.signOut() }}
              color="inherit"

            >LOG OUT</Button>
          </Toolbar>
          
      </AppBar>
      
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
             <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />

        <Divider />
        <List>
          <Link to="/profile">
            <ListItem button key="profile">
                <ListItemIcon> <AccountCircleIcon /> </ListItemIcon>
                <ListItemText primary="My Profile" />
            </ListItem>
          </Link>
          
          {/* <Link to=""> */}
            <ListItem button key="stories">
              <ListItemIcon> <BorderColorIcon /> </ListItemIcon>
              <ListItemText primary="My Stories" />
            </ListItem>
          {/* </Link> */}

          {/* <Link to=""> */}
            <ListItem button key="entries">
              <ListItemIcon> <PostAddIcon /> </ListItemIcon>
              <ListItemText primary="My Entries" />
            </ListItem>
            {/* </Link> */}
        </List>

        <Divider />

        <List>
          <ListItem button key="liked">
            <ListItemIcon> <FavoriteIcon /> </ListItemIcon>
            <ListItemText primary="Most Liked Stories" />
          </ListItem>

          <Link to='/about'>
            <ListItem button key="about">
              <ListItemIcon> <InfoIcon /> </ListItemIcon>
              <ListItemText primary="About Storify" />
            </ListItem>
          </Link>

          <ListItem button key="logout">
            <ListItemIcon> <ExitToAppIcon /> </ListItemIcon>
            <ListItemText onClick={() => { auth.signOut() }} primary="Log Out" />
          </ListItem>
        </List>
        </Drawer>
      </div>
    </ClickAwayListener>
  );
}
