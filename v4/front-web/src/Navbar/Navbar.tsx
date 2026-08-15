import React, {useEffect, useState} from 'react';
import './nav.css'
import hamburger from "./hamburger.png"
import xbutton from "./xbutton.png"

interface Props {
    title:string,
    children?:any
}

function Navbar(props:Props) {
    const [menu, setMenu] = useState<boolean>(false);
    const [mobile, setMobile] = useState<boolean>(window.innerWidth <= 1000);
    function toggleMenu() {
        setMenu(menu => (!menu))
    }
    //keep the layout honest when the window is resized or rotated
    useEffect(function() {
        function onResize() {
            let isMobile = window.innerWidth <= 1000;
            setMobile(isMobile);
            //never leave the drawer stranded open on desktop
            if (!isMobile) {
                setMenu(false)
            }
        }
        window.addEventListener("resize", onResize);
        return function() {
            window.removeEventListener("resize", onResize)
        }
    }, [])
    return (
        <div className = "nav-parent">
        <div className = "Navbar flex-row">
            {mobile && (!menu?
                <img className = "hamburger" alt = "Open menu" src = {hamburger} onClick = {toggleMenu}/>
                : <img className = "hamburger" alt = "Close menu" src = {xbutton} onClick = {toggleMenu} />)
            }
            <a className = "NavTitle" href = "/">
                {!mobile? "HEISE POWLESS": "HP"}
            </a>
            {!mobile?
                <div className = "NavLinks">
                    {props.children}
                </div>
                :
                <div></div>
            }
        </div>
        {mobile && menu &&
            <div className = "navLink-mobile">
                {props.children}
            </div>
        }
        </div>
    )
}




export default React.memo(Navbar);
