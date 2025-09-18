import React from 'react'

interface Props {
    route:string,
    title:string
}

function Navlink(props:Props) {
    return (
        <a className = "navlink-div" href = {props.route}>
            <div className = "navlink">{props.title}</div>
        </a>
    )
}



export default React.memo(Navlink);