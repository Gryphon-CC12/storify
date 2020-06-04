import React, { useState } from "react";
import { Link } from "react-router-dom";
//import signInWithGoogle from "../../firebaseConfig"
import { auth } from "../../firebaseConfig";
import firebase from '../../firebaseConfig';

const provider = new firebase.auth.GoogleAuthProvider();
const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const signInWithEmailAndPasswordHandler = (event, email, password) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email, password).catch(error => {
        setError("Error signing in with password and email!");
        console.error("Error signing in with password and email", error);
      });
    };

      const onChangeHandler = (event) => {
          const {name, value} = event.currentTarget;

          if(name === 'userEmail') {
              setEmail(value);
          }
          else if(name === 'userPassword'){
            setPassword(value);
          }
      };

  return (
    <div className="col">
      <div className="row">
        <h1>Sign In</h1>
      </div>

        {error !== null && <div className="col">{error}</div>}

            <form className="">

                  <label htmlFor="userEmail" className="block">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="my-1 p-1 w-full"
                    name="userEmail"
                    value = {email}
                    placeholder="E.g: faruq123@gmail.com"
                    id="userEmail"
                    onChange = {(event) => onChangeHandler(event)}
                  />
 
                  <label htmlFor="userPassword" className="block">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="mt-1 mb-3 p-1 w-full"
                    name="userPassword"
                    value = {password}
                    placeholder="Your Password"
                    id="userPassword"
                    onChange = {(event) => onChangeHandler(event)}
                  /> 


          <button className="btn btn-dark" onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
            Sign in
          </button>
            </form>

        <p className="text-center my-3">or</p>

          <button
            className="btn btn-dark" onClick={(event) => {signInWithGoogle()}}>
            Sign in with Google
          </button>

        <p className="text-center my-3">
          Don't have an account?{" "}
          <Link to="/signup" className="">
            Sign up here
          </Link>{" "}
          <br />{" "}
          <Link to="/passwordreset" className="">
            Forgot Password?
          </Link>
        </p>

    </div>
  );
};
export default SignIn;