import "./pick.css"
import Pick from "./Pick"
import {PickInterface} from "./Pick"
import { useEffect, useState } from "react"
import API from "../Form/API"
import back from "../images/ramsey.png"
import Background from "../Background/Background"
import { current_year } from "./WeeklyPicks"
import DropDown from "../General/DropDown"

interface Props {
    route:string
}


export default function PickPage({route}:Props) {
    const [picks, setPicks] = useState<PickInterface[]>([])
    const [year, setYear] = useState<string>(current_year.toString())
    useEffect(function() {
        (async function() {
            let api = new API(route,"get")
            let req = await api.query({year:year})
            if (req.success) {
                setPicks(req.payload)
            }
        })()
    }, [year])
    
    let years = []
    for (let i = 2015; i <= current_year; i++) {
        years.push(i.toString())
    }
    return (
        <Background title = "My Picks">
            <div className = "pick-list">
            <DropDown 
                    title = "Year"
                    currentSelection = {year}
                    options = {years}
                    onChange = {(year:string) => {setYear(year)}}
                />
            {picks.map(pick => (
                <Pick key = {`${pick.week.week}${pick.week.year}`} {...pick} />
            ))}
            {(picks.length === 0) &&
                    <div className = "error">
                        No Picks Yet
                    </div>
            }
        </div>
        </Background>
        
    )
}