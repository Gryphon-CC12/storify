import React, { useContext } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../../theme';

import Navbar from '../navbar/Navbar.js';
import ProfilePage from "../profilepage/ProfilePage";
import StoryList from "../../Components/storylist/StoryList"
import About from '../../Components/about/About';
import DisplayStory from '../../Components/displaystory/DisplayStory';
import CreateStory from '../../Components/createstory/CreateStory';
import SignUp from "../signup/SignUp";
import SignIn from "../signin/SignIn";
import PasswordReset from "../passwordreset/PasswordReset";
// import PageFooter from '../pagefooter/PageFooter';
import {v4 as uuidv4} from "uuid";
import { UserContext } from "../../providers/UserProvider";
import history from '../../history.js'

function Application() {
  const user = useContext(UserContext);
  
  return (
      user ?
      // <Router history={history} key={uuidv4()}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
            <Switch> 
                <Route exact path="/profile" component={ProfilePage} />
                <Route exact path="/" component={StoryList} />
                <Route exact path="/about" component={About} />
                <Route exact name="displaystory" path="/displaystory/:id" component={DisplayStory} />
                <Route exact path="/createstory" component={CreateStory} />   
                </Switch>
        {/* <PageFooter /> */}
        </ThemeProvider>
      // </Router>
      :    
      // <Router>
        <Switch> 
          <Route exact path="/signup" component={SignUp} />
          <Route path="/" component={SignIn} />
          <Route path="/passwordreset" component={PasswordReset} />
        </Switch> 

    // </Router>
    );
}
export default Application;