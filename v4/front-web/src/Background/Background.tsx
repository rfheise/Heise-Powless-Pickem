import React, { useEffect, useRef } from 'react'
import './background.css'
import {getRandomImage} from "../images/getRandomImage"
import Loading from "../General/Loading"


interface Props {
    //image is image url
    image?:string,
    //title is title of the page
    title:string,
    //optional visible page heading (falls back to title)
    heading?:string,
    //optional kicker line under the heading
    sub?:string,
    //set to hide the visible page heading entirely
    noHeading?:boolean,
    children:any,
    style?:any,
    // children is the body that goes on top of the image
    className ?: string,
}

//used to set a image background
//that has main components scroll on top of image
//mainly just to resue css and html
export function BackgroundParent(props:Props) {
    let image = useRef(getRandomImage());
    //keep the browser tab in sync with the page
    useEffect(function() {
        document.title = `${props.title} | Heise Powless`
    }, [props.title])
    let heading = props.heading !== undefined ? props.heading : props.title;
    return (

        <div className = "overlay-parent">
        <title>{props.title}</title>
        <div className = "main-overlay">
            <div className = "overlay">
            </div>
            <div className = "background">
                <img className = "background-img" src = {(props.image)? props.image : image.current} alt = "" />
            </div>
            <div id = "hp-main" className = {`main ${props.className?props.className : ""}`} style = {props.style}>
            {!props.noHeading &&
                <div className = "hp-page-head">
                    <h1 className = "hp-page-title">{heading}</h1>
                    {props.sub && <div className = "hp-page-sub">{props.sub}</div>}
                </div>
            }
            {props.children}
            </div>

        </div>

    </div>
    )
}
function Background(props:Props) {
   return (
    <BackgroundParent {...props}>
        <Loading>
            {props.children}
        </Loading>
    </BackgroundParent>
   )
}

export default React.memo(Background)
