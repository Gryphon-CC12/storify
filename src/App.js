import React, { useEffect, useState } from 'react';
import './App.scss';
import { Router } from "react-router-dom";

import Application from "./Components/application/Application";
import UserProvider from "./providers/UserProvider";
import history from './history.js'
import { v4 as uuidv4 } from "uuid";
import firebase from "./firebaseConfig";

function App() {

  const [userState, setUserState] = useState(false);
  useEffect(() => {

  firebase.auth().onAuthStateChanged(user=>{
    if (userState) {
        // store the user on local storage
      localStorage.setItem('userToken', JSON.stringify(user));
      setUserState(true);
      // window.location.reload();
      console.log("token set");
    } else {
        // removes the user from local storage on logOut
      localStorage.removeItem('userToken');
      setUserState(false);
      // window.location.reload();
      console.log("token deleted");
    }
  })
  }, [userState])

  return (
    <UserProvider>
      <Router history={history} key={uuidv4()}>
        <Application />
      </Router>
    </UserProvider>
  );
}

export default App;
