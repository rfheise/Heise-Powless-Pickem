import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavContext } from './NavContext'
import './nav.css'

interface Props {
    title:string,
    //routes this menu owns, used to highlight it on the page you're on
    routes:string[],
    children:any,
}

export default function NavMenu(props:Props) {
    const {mobile} = useContext(NavContext)
    const [open, setOpen] = useState<boolean>(false)
    const wrap = useRef<HTMLDivElement>(null)

    //close on a click outside the menu, or on escape
    useEffect(function() {
        if (!open) return
        function onDown(event:any) {
            if (wrap.current && !wrap.current.contains(event.target)) {
                setOpen(false)
            }
        }
        function onKey(event:any) {
            if (event.key === "Escape") setOpen(false)
        }
        document.addEventListener("mousedown", onDown)
        document.addEventListener("keydown", onKey)
        return function() {
            document.removeEventListener("mousedown", onDown)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    let path = window.location.pathname
    let active = props.routes.some(route => path.startsWith(route))

    //in the drawer there is nothing to drop down - show the group open
    if (mobile) {
        return (
            <div className = "nav-section">
                <div className = "nav-section-label">{props.title}</div>
                {props.children}
            </div>
        )
    }

    return (
        <div className = "nav-menu" ref = {wrap}>
            <button className = {`nav-menu-button${active? " is-active" : ""}`}
                aria-haspopup = "true"
                aria-expanded = {open}
                onClick = {() => setOpen(o => !o)}>
                {props.title}
                <span className = {`nav-menu-caret${open? " is-open" : ""}`} />
            </button>
            {open &&
                <div className = "nav-menu-panel" onClick = {() => setOpen(false)}>
                    {props.children}
                </div>
            }
        </div>
    )
}
