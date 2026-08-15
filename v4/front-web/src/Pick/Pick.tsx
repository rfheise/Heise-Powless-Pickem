import { Link } from "react-router-dom"
import {Team, User, Week} from "../General/Interfaces"
import Stat from "../General/Stat"
import API from "../Form/API"
import "../General/user.css"
import "./pick.css"

export interface PickInterface {
    picker:User,
    team:Team,
    week:Week,
    result:string,
    game:any
}

export default function Pick(props:PickInterface) {
    //result drives the accent stripe and the chip colour
    let tone;
    let resultLabel;
    if (props.result === "win") {
        tone = "win"
        resultLabel = "Win"
    } else if (props.result === "loss") {
        tone = "loss"
        resultLabel = "Loss"
    } else if (props.result === "tie") {
        tone = "muted"
        resultLabel = "Tie"
    } else {
        tone = "muted"
        resultLabel = "Pending"
    }
    let played = (props.game.home_score > 0 || props.game.away_score > 0)
    return (
        <Link className = {`hp-row is-norank is-${tone}`}
            to={{ pathname: `/picks/${props.picker.uuid}`, state: props.picker.uuid}}>
            <div className = "hp-row-avatar hp-row-logo">
                <img src = {API.generateLink(props.team.logo)} alt = {props.team.name} />
            </div>
            <div className = "hp-row-main">
                <div className = "hp-row-name">
                    {`${props.picker.first_name} ${props.picker.last_name}`}
                </div>
                <div className = "hp-row-note">{props.team.name}</div>
            </div>
            <div className = "hp-row-stats hp-pick-stats">
                {played &&
                    <Stat label = "Final" tone = "muted"
                        value = {`${props.game.home.abrv} ${props.game.home_score} – ${props.game.away.abrv} ${props.game.away_score}`} />
                }
                <Stat label = "Week" value = {props.week.week} />
                <Stat label = "Result" tone = {tone} value = {resultLabel} />
            </div>
        </Link>
    )
}
