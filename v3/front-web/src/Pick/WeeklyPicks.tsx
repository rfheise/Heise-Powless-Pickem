import { useContext, useEffect, useState } from "react"
import Pick,{PickInterface} from "./Pick"
import grand from "../images/christmas.png"
import Background from "../Background/Background"
import API from "../Form/API"
import "./pick.css"
import DropDown from "../General/DropDown"

export default function WeeklyPicks() {
    const [picks, setPicks] = useState<PickInterface[]>([])
    const [week, setWeek] = useState<string>("1")
    //after drop down changes
    useEffect(function(){
        (async function() {
            let api = new API(`/api/weekly_picks/week/${week}`, "get")
            let req = await api.query({})
            if (req.success) {
                setPicks(req.payload)
            }
        })()
    },[week])
    let weeks:string[] = []
    for(let i = 1; i <= 18; i++) {
        weeks.push((i).toString())
    }
    return (
        <Background title = "Weekly Picks">
            <div className = "pick-list">
                <DropDown 
                    title = "Week"
                    currentSelection = {week}
                    options = {weeks}
                    onChange = {(week:string) => {setWeek(week)}}
                />
                {picks.map(pick => (<Pick key = {pick.picker.username} {...pick}/>))}
                {(picks.length === 0) &&
                    <div className = "error">
                        No Picks Yet
                    </div>
                }
            </div>
        </Background>
    )
}