"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Navlink from "./Navbar/Navlink";
import NavButton from "./Navbar/NavButton";
import NavMenu from "./Navbar/NavMenu";
import { LoadingContext } from "./General/LoadingContext";
import API from "@/lib/api";

//The chrome that used to live in App.tsx: the nav, the skip link and the
//global loading flag. It wraps every route from the root layout, so it is
//mounted once and survives navigation instead of being torn down and rebuilt.
export default function AppShell({ children }: { children: any }) {
  const [loggedin, setLogin] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  API.setLoading = setLoading;

  function click() {
    window.location.href = loggedin ? "/logout" : "/login";
  }

  useEffect(function () {
    setLogin(Boolean(API.getToken()));
  }, []);

  return (
    <LoadingContext.Provider value={{ loading: loading, setLoading: setLoading }}>
      <div className="body">
        <a className="hp-skip" href="#hp-main">
          Skip to content
        </a>
        <Navbar title="Heise Powless">
          <Navlink route="/" title="Recap" />
          <Navlink route="/announcements" title="Announcements" />

          {/* Picks - what you pick and what everyone picked.
              Logged out there is only one of these, so it stays a plain link
              rather than a menu with a single item in it. */}
          {loggedin ? (
            <NavMenu
              title="Picks"
              routes={["/pick", "/my_picks", "/weekly_picks"]}
            >
              <Navlink route="/pick" title="Make A Pick" />
              <Navlink route="/my_picks" title="My Picks" />
              <Navlink route="/weekly_picks" title="Weekly Picks" />
            </NavMenu>
          ) : (
            <Navlink route="/weekly_picks" title="Weekly Picks" />
          )}

          {/* League - everything you read rather than do */}
          <NavMenu title="League" routes={["/standings", "/hof", "/career"]}>
            <Navlink route="/standings" title="Standings" />
            <Navlink route="/hof" title="Hall of Fame" />
            <Navlink route="/career" title="All Time" />
          </NavMenu>

          {/* Voting - preseason bans */}
          {loggedin ? (
            <NavMenu title="Voting" routes={["/vote", "/votes"]}>
              <Navlink route="/vote" title="Vote" />
              <Navlink route="/votes" title="Current Votes" />
            </NavMenu>
          ) : (
            <Navlink route="/votes" title="Current Votes" />
          )}

          {loggedin ? (
            <NavMenu title="Account" routes={["/propic", "/logout"]}>
              <Navlink route="/propic" title="Profile Picture" />
              <Navlink route="/logout" title="Logout" />
            </NavMenu>
          ) : (
            <NavButton title="Login" onClick={click} />
          )}
        </Navbar>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
