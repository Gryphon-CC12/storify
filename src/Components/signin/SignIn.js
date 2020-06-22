import React from "react";
// import { Link } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import firebase from '../../firebaseConfig';
import './SignIn.styles.scss';
import GoogleButton from 'react-google-button'

const provider = new firebase.auth.GoogleAuthProvider();
const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};


const SignIn = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // eslint-disable-next-line no-unused-vars
  // const [error, setError] = useState(null);
  
  // const signInWithEmailAndPasswordHandler = (event, email, password) => {
  //   event.preventDefault();
  //   auth.signInWithEmailAndPassword(email, password).catch(error => {
  //     setError("Error signing in with password and email!");
  //     console.error("Error signing in with password and email", error);
  //   });
  // };

  // const onChangeHandler = (event) => {
  //     const {name, value} = event.target;

  //     if(name === 'userEmail') {
  //         setEmail(value);
  //     }
  //     else if(name === 'userPassword'){
  //       setPassword(value);
  //     }
  // };

  return (
    <div className="container-fluid signin-wrapper">
      <div className="content-wrapper col-6">
        <div className="welcome">
          <h1>Welcome to <span className="styled">Storify!</span></h1>
        </div>
        <div className="tagline">
          <p>It's time to tell your story.</p>
        </div>
        <div className="google-signin">
          <GoogleButton
            className="google-btn"
            size="medium"
            onClick={signInWithGoogle()}
          />
      </div>
    </div>


          {/* <Grid id="email-signin" item xs={12} lg={6}>
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
          </Typography> */}
    </div>
  );
};
export default SignIn;