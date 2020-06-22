import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "../navbar/Navbar.js";
import ProfilePage from "../profilepage/ProfilePage";
import FeaturedStory from "../../Components/featuredstory/FeaturedStory";
import StoryList from "../storylist/StoryList";
import About from "../about/About";
import DisplayStory from "../displaystory/DisplayStory";
import CreateStory from "../createstory/CreateStory";
import SignUp from "../signup/SignUp";
import SignIn from "../signin/SignIn";
import PasswordReset from "../passwordreset/PasswordReset";
import { UserContext } from "../../providers/UserProvider";
// const userLocal = JSON.parse(localStorage.getItem('userToken'));

function Application() {
  const user = useContext(UserContext);
  
  // return userLocal ? (
  return user ? (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={StoryList} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact path="/about" component={About} />
          <Route exact path="/displaystory/:id" component={DisplayStory} />
          <Route exact path="/createstory" component={CreateStory} />
          <Route exact path="/featuredstory" component={FeaturedStory} />
        </Switch>
      </>
  ) : (
    <Switch>
      {/* <Route exact path="/signup" component={SignUp} /> */}
      <Route exact path="/" component={SignIn} />
      {/* <Route path="/passwordreset" component={PasswordReset} /> */}
    </Switch>
  );
}
export default Application;
