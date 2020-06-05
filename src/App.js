import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Application from "./Components/application/Application";
import UserProvider from "./providers/UserProvider";

function App() {

  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
}

export default App;
