import React, {useState} from 'react';
import './nav.css'
import hamburger from "./hamburger.png"
import xbutton from "./xbutton.png"
interface Props {
    title:string,
    children?:any
}

function Navbar(props:Props) {
    const [menu, setMenu] = useState<boolean>(false);
    function toggleMenu() {
        setMenu(menu => (!menu))
    }
    let mobile = (window.innerWidth <= 1000);
    return (
        <div className = "nav-parent">
        <div className = "Navbar flex-row">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Alumni+Sans:ital,wght@1,700&family=Lora&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
            {mobile && (!menu? 
                <img className = "hamburger" src = {hamburger} onClick = {toggleMenu}/>
                : <img className = "hamburger" src = {xbutton} onClick = {toggleMenu} />)
            }
            <div className = "NavTitle">
                {!mobile? "HEISE POWLESS": "HP"}
            </div>
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




