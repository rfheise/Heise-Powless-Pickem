"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { getRandomImage } from "@/images/getRandomImage";
import Loading from "../General/Loading";

interface Props {
  //image is image url
  image?: StaticImageData;
  //title is title of the page
  title: string;
  //optional visible page heading (falls back to title)
  heading?: string;
  //optional kicker line under the heading
  sub?: string;
  //set to hide the visible page heading entirely
  noHeading?: boolean;
  children: any;
  style?: any;
  // children is the body that goes on top of the image
  className?: string;
}

//used to set a image background
//that has main components scroll on top of image
//mainly just to resue css and html
export function BackgroundParent(props: Props) {
  //A page that does not name its own photo gets a random one, as before.
  //The draw happens after mount rather than during render: a random value
  //picked on the server would not match the one the browser picks, and react
  //would throw out the server html to fix the difference.
  const [random, setRandom] = useState<StaticImageData | null>(null);
  useEffect(function () {
    setRandom(getRandomImage());
  }, []);

  let image = props.image ? props.image : random;
  let heading = props.heading !== undefined ? props.heading : props.title;
  return (
    <div className="overlay-parent">
      <div className="main-overlay">
        <div className="overlay"></div>
        <div className="background">
          {image && (
            <Image
              className="background-img"
              src={image}
              alt=""
              fill
              sizes="100vw"
              priority
            />
          )}
        </div>
        <div
          id="hp-main"
          className={`main ${props.className ? props.className : ""}`}
          style={props.style}
        >
          {!props.noHeading && (
            <div className="hp-page-head">
              <h1 className="hp-page-title">{heading}</h1>
              {props.sub && <div className="hp-page-sub">{props.sub}</div>}
            </div>
          )}
          {props.children}
        </div>
      </div>
    </div>
  );
}

function Background(props: Props) {
  return (
    <BackgroundParent {...props}>
      <Loading>{props.children}</Loading>
    </BackgroundParent>
  );
}

export default React.memo(Background);
