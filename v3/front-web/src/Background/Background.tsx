import React from 'react'
import './background.css'



interface Props {
    //image is image url
    image:string,
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
function Background(props:Props) {
    return (
        <div className = "overlay-parent">
        <title>{props.title}</title>
        <div className = "main-overlay">
            <div className = "overlay">

            </div>
            <div className = "background">
                <img className = "background-img" src = {props.image} alt = "houston" />
            </div>
            <div className = {`main ${props.className?props.className : ""}`} style = {props.style}>
                {props.children}
            </div>
                
        </div>
            
    </div>
    )
    
}
export default React.memo(Background)