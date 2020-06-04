import React, {useState} from 'react';
// import GoogleLogin from 'react-google-login';
// or
import { GoogleLogin } from 'react-google-login';
import GoogleBtn from '../../GoogleBtn';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

import Logout from "../logout/Logout"

const db = firebase.firestore();

function saveToUsers(userEmail, userName, userExist) {
  console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
        //event.preventDefault();
        console.log("e for stories");
      db.collection("UserDatabase").add({
        id: uuidv4(),
        dateCreated: new Date(),
        email: userEmail,
        userName: userName,
        linkToEntries: [],
        linkToStories: [],
        upVotedStories: [],
        likedEntries: []
      }).then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        }); 
    }
    localStorage.setItem('token', true)
}

function Login() {

  const [userExist, setUserExist] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const responseGoogle = (response) => {
  console.log(response);
  let userEmail = response.profileObj.email
  let userName = response.profileObj.name
//   db.collection('UserDatabase').where('email', '==', userEmail).get()
//   .then(function(querySnapshot) {
//       console.log('userEmail', userEmail);
//       // setUserExist(true);
//       // setIsLoggedIn(true);
//   })
  saveToUsers(userEmail, userName, userExist);
}
    


    return (
      <>
      {/* <GoogleBtn /> */}
      <GoogleLogin
        clientId="336851866169-pgf0mr1e3is106a8ptuu19h3urf8tp7n.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        isSignedIn={true}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
      {/* <Logout /> */}
      </>
    );
}

export default Login;
