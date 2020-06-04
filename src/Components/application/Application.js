import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "../signin/SignIn";
import SignUp from "../signup/SignUp";
import ProfilePage from "../profilepage/ProfilePage";
import PasswordReset from "../passwordreset/PasswordReset";
import Navbar from '../navbar/Navbar.js';


function Application() {
  const user = null;
  console.log("USERRR", user)
  return (
    <Router>
          <Switch>
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/signup" component={SignUp} />
            <Route path="/" component={SignIn} />
            
            <Route path="/passwordreset" component={PasswordReset} />
          </Switch>
        </Router>
    );
}
export default Application;