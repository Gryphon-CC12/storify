import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "../signin/SignIn";
import SignUp from "../signup/SignUp";
import ProfilePage from "../profilepage/ProfilePage";
import PasswordReset from "../passwordreset/PasswordReset";
import Navbar from '../navbar/Navbar.js';
// import UserProvider from "../../providers/UserProvider";
import { UserContext } from "../../providers/UserProvider";
import StoryList from "../../Components/storylist/StoryList"
import DisplayStory from '../../Components/displaystory/DisplayStory';
import CreateStory from '../../Components/createstory/CreateStory';
import SideMenu from '../../Components/sidemenu/SideMenu';
import About from '../../Components/about/About';

function Application() {
  const user = useContext(UserContext);
  
  return (
      user ?
      <Router>
        <div className="container">
          <div className="row">
            <Navbar />
          </div>
          <div className="row">
            <div className="col-2">
              <SideMenu />
            </div>
            <div className="col">
              <Switch> 
                <Route exact path="/profile" component={ProfilePage} />
                <Route exact path="/" component={StoryList} />
                <Route path="/about" component={About} />
                <Route exact name="displaystory" path="/displaystory/:id" component={DisplayStory} />
                <Route path="/createstory" component={CreateStory} />   
              </Switch>
            </div>
          </div> 
        </div>
      </Router>
      :    
    <Router>
      <Switch> 
        <Route exact path="/signup" component={SignUp} />
        <Route path="/" component={SignIn} />
        <Route path="/passwordreset" component={PasswordReset} />
      </Switch>
    </Router>
    );
}
export default Application;