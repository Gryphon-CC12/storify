import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import DisplayStory from './Components/displaystory/DisplayStory';
import CreateStory from './Components/createstory/CreateStory';
import Navbar from './Components/navbar/Navbar.js';
// import SideMenu from './Components/sidemenu/SideMenu.js';
// import StoryPreview from './Components/storypreview/StoryPreview.js';
import StoryList from './Components/storylist/StoryList.js';
import AddEntry from './Components/addentry/AddEntry.js';
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
        </div>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/displaystory" component={DisplayStory} />
        <Route path="/createstory" component={CreateStory} />
      </Switch>
      <div className="row">
        <StoryList />
      </div>
      <div className="col-10">
          <AddEntry />
      </div>
      <div>
        <Link to="/createstory">
          <button>Create Story</button>
        </Link>
      </div>
      </Router>
  );
}

export default App;
