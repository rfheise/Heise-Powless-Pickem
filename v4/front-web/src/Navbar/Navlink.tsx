import React from 'react'

interface Props {
    route:string,
    title:string
}

function Navlink(props:Props) {
    //highlight the link for the page you are on
    let path = window.location.pathname;
    let active = (props.route === "/") ? path === "/" : path.startsWith(props.route);
    return (
        <a className = "navlink-div" href = {props.route}>
            <div className = {`navlink${active ? " is-active" : ""}`}>{props.title}</div>
        </a>
    )
}



export default React.memo(Navlink);
