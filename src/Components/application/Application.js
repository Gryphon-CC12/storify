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
// import SideMenu from './Components/sidemenu/SideMenu.js';
import About from '../../Components/about/About';

function Application() {
  // const user = null;
  const user = useContext(UserContext);
  console.log("USERRR", user)
  
  return (
      user ?
      <Router>
        <Route exact path="/" component={Navbar} />
        <Switch> 
        <Route exact path="/" component={ProfilePage} />
        <Route exact path="/storylist" component={StoryList} />
        <Route path="/about" component={About} />
        <Route exact name="displaystory" path="/displaystory/:id" component={DisplayStory} />
        <Route path="/createstory" component={CreateStory} />   
        </Switch>
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