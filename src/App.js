import React from 'react';
import logo from './logo.svg';
import './App.scss';
import firebase from './firebaseConfig';
import APITest from './Components/APITest';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DisplayStory from './Components/displaystory/DisplayStory'
import Navbar from './Components/navbar/Navbar.js'
import SideMenu from './Components/sidemenu/SideMenu.js'
import StoryPreview from './Components/storypreview/StoryPreview.js'
import StoryList from './Components/storylist/StoryList.js'
import AddEntry from './Components/addentry/AddEntry.js'
import About from './Components/about/About.js'

function App() {
  return (

<Router>
    <div className="App container-fluid">
      <div className="row">
        <div className="col">
          <Navbar />
          
        </div>
      </div>
    </div>
  <Switch>
    <Route path="/about" component={About} />
    <Route path="/displaystory" component={DisplayStory} />
    </Switch>
      <div className="row">
          <StoryList />
      </div>
      <div className="col-12">
        <AddEntry />
      </div>
  </Router>

  );
}

export default App;
