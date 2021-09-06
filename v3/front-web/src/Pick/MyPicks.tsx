import "./pick.css"
import Pick from "./Pick"
import {PickInterface} from "./Pick"
import { useEffect, useState } from "react"
import API from "../Form/API"
import back from "../images/ramsey.png"
import Background from "../Background/Background"

export default function MyPicks() {
    const [picks, setPicks] = useState<PickInterface[]>([])
    useEffect(function() {
        (async function() {
            let api = new API("/api/mypicks","get")
            
            let req = await api.query({})
            console.log(req.payload)
            if (req.success) {
                setPicks(req.payload)
            }
        })()
    }, [])
    return (
        <Background image = {back} title = "My Picks">
            <div className = "pick-list">
            {picks.map(pick => (
                <Pick key = {pick.week.week} {...pick} />
            ))}
        </div>
        </Background>
        
    )
}