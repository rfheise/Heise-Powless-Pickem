import { useContext, useEffect, useState } from "react"
import Pick,{PickInterface} from "./Pick"
import grand from "../images/christmas.png"
import Background from "../Background/Background"
import API from "../Form/API"
import "./pick.css"
import DropDown from "../General/DropDown"
import {Week} from "../General/Interfaces"

export default function WeeklyPicks() {
    const [picks, setPicks] = useState<PickInterface[]>([])
    const [week, setWeek] = useState<string>("")
    //gets picks for the week with the current week variable
    async function getPicks() {
        let api = new API(`/api/weekly_picks/week/${week}`, "get")
        let req = await api.query({})
        if (req.success) {
            setPicks(req.payload)
        }
    }
    //gets current week
    async function getCurrentWeek() {
        let api = new API(`/api/current_week`,"get")
        let req = await api.query({})
        if (req.success) {
            //set current week
            setWeek("" + req.payload.week)
        } else {
            //else use default week
            setWeek("1")
        }
    }
    //after drop down changes
    useEffect(function(){
        //if no week yet get the current week
        if (week === "") {
            getCurrentWeek();
        } else {
            getPicks();
        }
        
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