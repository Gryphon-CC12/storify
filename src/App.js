import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebaseConfig';
import APITest from './Components/APITest';
//const db = firebase.firestore();


//var promptStory = prompt("Please enter your prompt", "Harry Potter");


// function savetoDatabase(promptStory) {
//   db.collection("Entries").add({
//           text: promptStory,
//       })
//       .then(function () {
//           console.log("Document successfully written!");
//           //window.location = "/";
//           alert("Game successfully saved!")
//       })
//       .catch(function (error) {
//           console.error("Error writing document: ", error);
//       });
// }

  

//setTimeout(function(){ savetoDatabase(promptStory) }, 3000);



function TestDB() {
  return (
    <div>
    <APITest />
    <form>
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <input type="submit" value="Submit" />
    </form>
    </div>
  )
}


function App() {



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World!
        </p>
        <TestDB />
      </header>
    </div>
  );
}

export default App;
