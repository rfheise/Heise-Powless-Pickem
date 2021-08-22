import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Navbar, Navlink} from "./Navbar/Exports";
import SignUp from "./Login/SignUp"
import Login from "./Login/Login"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
    <div className = "body">
      <Navbar title = "Heise Powless">
        <Navlink route = "/announcements" title = "Announcements" />
      </Navbar>
    <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path = "/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
