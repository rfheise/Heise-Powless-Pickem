import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {Navbar, Navlink, NavButton} from "./Navbar/Exports";
import SignUp from "./Login/SignUp"
import Login from "./Login/Login"
import Voting from "./Voting/Route"
import Logout from "./Login/Logout"
import Votes from "./Voting/VoteList"
import HallOfFame from './HallOfFame/Route';
import Pick from "./Pick/Route"
import MyPick from "./Pick/MyPicks"
import OtherPicks from "./Pick/OtherPicks"
import WeeklyPicks from './Pick/WeeklyPicks';
import Standings from './Standings/Route';
import {

  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Announcements from './Announcements/Route';
import API from './Form/API';

function App() {
  const [loggedin, setLogin] = useState<Boolean>(false);
  function click() {
    window.location.href = (loggedin ?
      "/logout" : "/login"
    )
  }
  useEffect(function() {
    // (async function() {
    //     let req = await fetch(API.generateLink("/api/loggedin"),
    //       {headers:{"Authorization":`Token ${API.getToken()}`},method:"get"}
    //     )
    //     setLogin(req.status == 200)
    // })()
    setLogin(Boolean(API.getToken()))
  },[]) 
  return (
    <Router>
    <div className = "body">
      <Navbar title = "Heise Powless">
        <Navlink route = "/" title = "Announcements" />
        {loggedin &&
        <div className = "loggedin-nav">
          <Navlink route = "/vote" title = "Vote" />
          <Navlink route = "/pick" title = "Pick" />
          <Navlink route = "/my_picks" title = "My Picks" />
        </div>
        }
        <Navlink route = "/standings" title = "Standings" />
        <Navlink route = "/weekly_picks" title = "Weekly Picks" />
        <Navlink route = "/votes" title = "Current Votes" />
        <Navlink route = "/hof" title = "Hall of Fame" />
        <NavButton title = {loggedin ? "Logout" : "Login"} onClick = {click}/>
      </Navbar>
    <Switch>
          <Route exact path = "/logout">
            <Logout />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path = "/login">
            <Login />
          </Route>
          <Route exact path = "/">
              <Announcements />
          </Route> 
          <Route exact path = "/vote">
            <Voting />
          </Route>
          <Route exact path = "/hof">
            <HallOfFame />
          </Route>
          <Route exact path = "/votes">
            <Votes />
          </Route>
          <Route exact path = "/pick">
            <Pick />
          </Route>
          <Route exact path = "/my_picks">
            <MyPick />
          </Route>
          <Route exact path = "/weekly_picks">
            <WeeklyPicks />
          </Route>
          <Route exact path = "/standings">
            <Standings />
          </Route>
          <Route exact path = "/picks/*">
            <OtherPicks />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
