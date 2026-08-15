"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  route: string;
  title: string;
}

function Navlink(props: Props) {
  //highlight the link for the page you are on. usePathname is filled in on
  //the server too, so the active link is correct in the first html rather
  //than only after hydration.
  let path = usePathname();
  let active =
    props.route === "/" ? path === "/" : path.startsWith(props.route);
  return (
    <Link className="navlink-div" href={props.route}>
      <div className={`navlink${active ? " is-active" : ""}`}>{props.title}</div>
    </Link>
  );
}

export default React.memo(Navlink);
