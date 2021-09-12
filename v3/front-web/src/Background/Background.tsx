import React, { useContext, useRef, useState } from 'react'
import './background.css'
import {getRandomImage} from "../images/getRandomImage"
import Loading from "../General/Loading"
import { LoadingContext } from '../App';


interface Props {
    //image is image url
    image?:string,
    //title is title of the page
    title:string,
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
    return (
        
        <div className = "overlay-parent">
        <title>{props.title}</title>
        <div className = "main-overlay">
            <div className = "overlay">
            </div>
            <div className = "background">
                <img className = "background-img" src = {(props.image)? props.image : image.current} alt = "bruh" />
            </div>
            <div className = {`main ${props.className?props.className : ""}`} style = {props.style}>
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