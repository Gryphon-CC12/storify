import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { auth } from "../../firebaseConfig";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PostAddIcon from "@material-ui/icons/PostAdd";
import InfoIcon from "@material-ui/icons/Info";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import theme from "../../theme";

import "./Navbar.styles.scss";

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    color: "rgb(50, 121, 109)",
    textDecoration: "none",
    fontSize: "20px",
  },
  listItem: {
    color: "rgb(50, 121, 109)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: "800",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  dropdown: {
    position: "absolute",
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
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
      <div id="navbar">
        <CssBaseline />
        <AppBar
          id="AppBar"
          position="fixed"
          className={clsx({
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              classes={{ label: "menu-icon" }}
              // color="#034078"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" id="logo">
              <Typography id="app-title" variant="h6" noWrap>
                Storify
              </Typography>
            </Link>

            <Link to="/" id="home-link">
              <Button classes={{ label: "navbar-link" }}>HOME</Button>
            </Link>

            <Link to="/createstory">
              <Button classes={{ label: "navbar-link" }}>CREATE STORY</Button>
            </Link>

            <Link to="/">
              <Button
                classes={{ label: "navbar-link" }}
                onClick={() => {
                  auth.signOut();
                }}
              >
                LOG OUT
              </Button>
            </Link>
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
            <Link className="side-link" to="/profile" onClick={handleDrawerClose}>
              <ListItem button key="profile" className={classes.listItem}>
                <ListItemIcon>
                  {" "}
                  <AccountCircleIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
            </Link>

            <Link className="side-link" to="/createstory">
              <ListItem button key="create" onClick={handleDrawerClose} className={classes.listItem}>
                <ListItemIcon>
                  {" "}
                  <PostAddIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Create A Story" />
              </ListItem>
            </Link>

          <Divider />

          <Link className="side-link" to="/featuredstory">               
            <ListItem button key="create" onClick={handleDrawerClose} className={classes.listItem}>                 
            <ListItemIcon>                   
              {" "}                   
              <PostAddIcon />{" "}                 
            </ListItemIcon>                 
            <ListItemText primary="Featured" />               
            </ListItem>             
          </Link>

            <Link className="side-link" to="/about">
              <ListItem button key="about" onClick={handleDrawerClose} className={classes.listItem}>
                <ListItemIcon>
                  {" "}
                  <InfoIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItem>
            </Link>

            <ListItem button key="logout" onClick={handleDrawerClose} className={classes.listItem}>
              <ListItemIcon>
                {" "}
                <ExitToAppIcon />{" "}
              </ListItemIcon>
              <ListItemText
                onClick={() => {
                  auth.signOut();
                }}
                primary="Log Out"
              />
            </ListItem>
          </List>
        </Drawer>
      </div>
    </ClickAwayListener>
  );
}
