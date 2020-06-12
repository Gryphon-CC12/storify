import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import firebase from '../../firebaseConfig';
import './SignIn.styles.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import GoogleButton from 'react-google-button'

const provider = new firebase.auth.GoogleAuthProvider();
const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const classes = useStyles();
  
  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => {
      setError("Error signing in with password and email!");
      console.error("Error signing in with password and email", error);
    });
  };

  const onChangeHandler = (event) => {
      const {name, value} = event.target;

      if(name === 'userEmail') {
          setEmail(value);
      }
      else if(name === 'userPassword'){
        setPassword(value);
      }
  };

  return (
    <div id="wrapper">
      <CssBaseline />
        <Grid
          id="white"
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid id="title" item xs={12}>
            <h1>Welcome to <span id="storify">Storify!</span></h1>
          </Grid>
          <Grid id="google-signin" item xs={12} lg={6}>
            <GoogleButton
              size="medium"
              className={classes.margin}
              onClick={(event) => { signInWithGoogle() }}
            >
            </GoogleButton>
          </Grid>


          <Grid id="email-signin" item xs={12} lg={6}>
            Or sign in with an email address:
            <FormControl className={clsx(classes.margin, classes.textField)} noValidate autoComplete="on">
              <InputLabel htmlFor="email">Email</InputLabel>    
              <Input
                id="email"
                type={'email'}
                onChange={(event) => onChangeHandler(event)}
              />
            </FormControl>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type={'password'}
                onChange={(event) => onChangeHandler(event)}
              />
              <Button
                id="signin-btn"
                className="btn btn-dark"
                variant="contained"
                    onClick={(event) => { signInWithEmailAndPasswordHandler(event, email, password) }}>
                    Sign in
              </Button>
            </FormControl>
          </Grid>

        <Typography id="links">
            <Link to="/signup">
              Not a member?
            </Link>{" "}
            <br />{" "}
            <Link to="/passwordreset" className="">
              Forgot Password?
            </Link>
          </Typography>
        </Grid>
    </div>
  );
};
export default SignIn;