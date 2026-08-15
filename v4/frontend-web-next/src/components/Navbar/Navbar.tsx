"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import hamburger from "@/images/hamburger.png";
import xbutton from "@/images/xbutton.png";
import { NavContext } from "./NavContext";

interface Props {
  title: string;
  children?: any;
}

//The bar renders both the desktop link row and the mobile drawer every time
//and lets the stylesheet decide which one is on screen.
//
//The create-react-app version measured window.innerWidth to pick between
//them, which cannot run on the server - it would have meant shipping the
//desktop bar in the html and swapping to the mobile one after hydration, a
//visible flash on every phone. The breakpoint is a media query now, so the
//first paint is already correct.
function Navbar(props: Props) {
  const [menu, setMenu] = useState<boolean>(false);
  const pathname = usePathname();

  function toggleMenu() {
    setMenu((menu) => !menu);
  }

  //Close the drawer once the route actually changes.
  //
  //Every nav link used to be a plain <a>, so following one reloaded the page
  //and reset this state as a side effect. Navigation is client side now and
  //the bar stays mounted, so the drawer has to be closed on purpose - it also
  //covers going back and forward with the drawer open.
  useEffect(
    function () {
      setMenu(false);
    },
    [pathname],
  );

  //Tapping the link for the page you are already on does not change the
  //pathname, so the effect above never fires. Close on the tap itself too.
  function onDrawerClick(event: any) {
    if (event.target.closest("a")) {
      setMenu(false);
    }
  }

  //never leave the drawer stranded open if the window grows past the
  //breakpoint - the css hides it, but it should not reappear on the way back
  useEffect(function () {
    function onResize() {
      if (window.innerWidth > 1000) {
        setMenu(false);
      }
    }
    window.addEventListener("resize", onResize);
    return function () {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="nav-parent">
      <div className="Navbar flex-row">
        <Image
          className="hamburger"
          alt={menu ? "Close menu" : "Open menu"}
          src={menu ? xbutton : hamburger}
          onClick={toggleMenu}
        />
        <Link className="NavTitle" href="/">
          <span className="NavTitle-full">HEISE POWLESS</span>
          <span className="NavTitle-short">HP</span>
        </Link>
        <NavContext.Provider value={{ mobile: false }}>
          <div className="NavLinks">{props.children}</div>
        </NavContext.Provider>
      </div>
      {menu && (
        <NavContext.Provider value={{ mobile: true }}>
          <div className="navLink-mobile" onClick={onDrawerClick}>
            {props.children}
          </div>
        </NavContext.Provider>
      )}
    </div>
  );
}

export default React.memo(Navbar);
