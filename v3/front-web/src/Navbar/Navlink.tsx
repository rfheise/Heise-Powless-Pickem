import React from 'react'

interface Props {
    route:string,
    title:string
}

function Navlink(props:Props) {
    return (
        <div className = "navlink-div">
            <a className = "navlink" href = {props.route}>{props.title}</a>
        </div>
    )
}



export default React.memo(Navlink);