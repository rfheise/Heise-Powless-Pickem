import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {Navbar, Navlink, NavButton} from "./Navbar/Exports";
import NavMenu from "./Navbar/NavMenu";
import SignUp from "./Account/SignUp"
import Login from "./Account/Login"
import Voting from "./Voting/Route"
import Logout from "./Account/Logout"
import Votes from "./Voting/VoteList"
import HallOfFame from './HallOfFame/Route';
import HallOfShame from './HallOfFame/Shame';
import Pick from "./Pick/Route"
import MyPick from "./Pick/MyPicks"
import OtherPicks from "./Pick/OtherPicks"
import WeeklyPicks from './Pick/WeeklyPicks';
import Standings from './Standings/Route';
import Recap from './Recap/Route';
import Career from './Career/Route';
import ProPic from './Account/proPic'
import {

  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Announcements from './Announcements/Route';
import API from './Form/API';

//the `any` belongs on the generic, not the variable - annotating the variable
//as `any` erases Context<T> and makes useContext() infer `unknown`
export const LoadingContext = React.createContext<any>(null);

function App() {
  const [loggedin, setLogin] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  API.setLoading = setLoading;
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
    <LoadingContext.Provider value = {{loading:loading, setLoading:setLoading}}>
    <div className = "body">
      <a className = "hp-skip" href = "#hp-main">Skip to content</a>
      <Navbar title = "Heise Powless">
        <Navlink route = "/" title = "Recap" />
        <Navlink route = "/announcements" title = "Announcements" />

        {/* Picks - what you pick and what everyone picked.
            Logged out there is only one of these, so it stays a plain link
            rather than a menu with a single item in it. */}
        {loggedin ?
          <NavMenu title = "Picks" routes = {["/pick","/my_picks","/weekly_picks"]}>
            <Navlink route = "/pick" title = "Make A Pick" />
            <Navlink route = "/my_picks" title = "My Picks" />
            <Navlink route = "/weekly_picks" title = "Weekly Picks" />
          </NavMenu>
          :
          <Navlink route = "/weekly_picks" title = "Weekly Picks" />
        }

        {/* League - everything you read rather than do */}
        <NavMenu title = "League" routes = {["/standings","/hof","/career"]}>
          <Navlink route = "/standings" title = "Standings" />
          <Navlink route = "/hof" title = "Hall of Fame" />
          <Navlink route = "/career" title = "All Time" />
        </NavMenu>

        {/* Voting - preseason bans */}
        {loggedin ?
          <NavMenu title = "Voting" routes = {["/vote","/votes"]}>
            <Navlink route = "/vote" title = "Vote" />
            <Navlink route = "/votes" title = "Current Votes" />
          </NavMenu>
          :
          <Navlink route = "/votes" title = "Current Votes" />
        }

        {loggedin ?
          <NavMenu title = "Account" routes = {["/propic","/logout"]}>
            <Navlink route = "/propic" title = "Profile Picture" />
            <Navlink route = "/logout" title = "Logout" />
          </NavMenu>
          :
          <NavButton title = "Login" onClick = {click}/>
        }
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
              <Recap />
          </Route>
          <Route exact path = "/announcements">
              <Announcements />
          </Route> 
          <Route exact path = "/vote">
            <Voting />
          </Route>
          <Route exact path = "/hof">
            <HallOfFame />
          </Route>
          <Route exact path = "/hall_of_shame">
            <HallOfShame />
          </Route>
          <Route exact path = "/votes">
            <Votes />
          </Route>
          <Route exact path = "/pick">
            <Pick />
          </Route>
          <Route exact path = "/propic">
            <ProPic />
          </Route>
          <Route exact path = "/my_picks">
            <MyPick />
          </Route>
          <Route exact path = "/weekly_picks">
            <WeeklyPicks />
          </Route>
          <Route exact path = "/recap">
            <Recap />
          </Route>
          <Route exact path = "/career">
            <Career />
          </Route>
          <Route exact path = "/standings">
            <Standings />
          </Route>
          <Route exact path = "/picks/*">
            <OtherPicks />
          </Route>
        </Switch>
      </div>          
      </LoadingContext.Provider>
    </Router>
  );
}

export default App;
