import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DisplayStory from './Components/displaystory/DisplayStory';
import CreateStory from './Components/createstory/CreateStory';
import Navbar from './Components/navbar/Navbar.js';
// import SideMenu from './Components/sidemenu/SideMenu.js';
import StoryList from './Components/storylist/StoryList.js';
import About from './Components/about/About.js';
import Login from './Components/login/Login'
import Logout from './Components/logout/Logout'

import ProfilePage from './Components/profilepage/ProfilePage'
import Application from "./Components/application/Application";
import UserProvider from "./providers/UserProvider";

function App() {

  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
  // return (
  // <>
  //     <Router>
  //     user ?
  //       <div className="App container-fluid">
  //         <div className="row">
  //           <div className="col">
  //             <Navbar />
  //           </div>
  //         </div>
  //         <ProfilePage />
  //         <CreateStory/>
  //     <Switch>
  //       {/* <Route exact path="/" component={Login} /> */}
  //       <Route exact path="/storylist" component={StoryList} />
  //       <Route path="/about" component={About} />
  //       <Route exact name="displaystory" path="/displaystory/:id" component={DisplayStory} />
  //       <Route path="/createstory" component={CreateStory} />   
  //         </Switch>
  // </div>
  //     {/* </Router> */}

  //     :
  //     {/* <Router> */}
  //       <Switch>
  //         {/* <SignUp path="signUp" component={SignUp} />
  //         <SignIn path="/" component={SignIn}/>
  //         <PasswordReset path = "passwordReset" component={PasswordReset} /> */}
  //       </Switch>
  //     </Router>

  // </> 
  // );
}

export default App;
