import React, { useEffect, useState } from 'react';
import './App.scss';
import { Router } from "react-router-dom";
import Application from "./Components/application/Application";
import UserProvider from "./providers/UserProvider";
import history from './history.js'
import { v4 as uuidv4 } from "uuid";
import firebase from "./firebaseConfig";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary"

//let last_enty_uri = '"Yes...." the cat said, feeling out of shape and not quite what he used to be. "Well how about I tell you one of the stories of a hit I had. Maybe then youll believe me... Back in June of 2001 I had been assigned to remove a high profile target, however things werent going to be that easy...';
function App() {


// setInterval(callAPI(), 60000);
// function callAPI() {
// fetch("http://ec2-3-115-72-145.ap-northeast-1.compute.amazonaws.com/generate/" + last_enty_uri)
//           .then(response => {
//             return response.json()
//           })
//             .then(async output=>{
//               console.log("output.result", output.result)
//           })
//         }
  const [userState, setUserState] = useState(true);
  useEffect(() => {

  firebase.auth().onAuthStateChanged(user=>{
    if (userState) {
        // store the user on local storage
        //console.log('userToken', user);
        
      localStorage.setItem('userToken', JSON.stringify(user));
      setUserState(true);
      
      //setTimeout(function(){ window.location.reload(); }, 12000);
      //console.log("token set");
    } else {
        // removes the user from local storage on logOut
      localStorage.removeItem('userToken');
      setUserState(false);
      //window.location.reload();
      //console.log("token deleted");
    }
  })
  }, [userState])
  
  
  return (
  //  <ErrorBoundary> 
    <UserProvider>
      <Router history={history} key={uuidv4()}>
        <Application />
      </Router>
    </UserProvider>
    //</ErrorBoundary>
  );
}

export default App;
