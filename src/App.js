import React from 'react';
import './App.scss';
import { Router } from "react-router-dom";

import Application from "./Components/application/Application";
import UserProvider from "./providers/UserProvider";
import history from './history.js'
import { v4 as uuidv4 } from "uuid";

function App() {

  return (
    <UserProvider>
      <Router history={history} key={uuidv4()}>
        <Application />
      </Router>
    </UserProvider>
  );
}

export default App;
