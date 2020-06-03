import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DisplayStory from './Components/displaystory/DisplayStory';
import CreateStory from './Components/createstory/CreateStory';
import Navbar from './Components/navbar/Navbar.js';
// import SideMenu from './Components/sidemenu/SideMenu.js';
import StoryList from './Components/storylist/StoryList.js';
import About from './Components/about/About.js';

function App() {
  return (
    <Router>
        <div className="App container-fluid">
          <div className="row">
            <div className="col">
              <Navbar />
            </div>
          </div>
      <Switch>
        <Route exact path="/" component={StoryList} />
        <Route path="/about" component={About} />
        <Route exact name="displaystory" path="/displaystory/:id" component={DisplayStory} />
        <Route path="/createstory" component={CreateStory} />
      </Switch>
      </div>
    </Router>
  );
}

export default App;
