import Text from "../General/Text"
import { Link } from "react-router-dom"
import {Team, User, Week} from "../General/Interfaces"
import Propic from "../General/Propic"
import API from "../Form/API"

export interface PickInterface {
    picker:User,
    team:Team,
    week:Week,
    result:string,
}

export default function Pick(props:PickInterface) {
    let color;
    if (props.result == "win") {
        color = "#247d1e"
    } else if(props.result == "loss") {
        color = "#c41414"
    } else {
        color = "#707070"
    }
    return (
        <Link style = {{textDecoration:"none"}} to={{ pathname: `/picks/${props.picker.uuid}`, state: props.picker.uuid}}>
        <div className = "user-box">
            <Propic image = {API.generateLink(props.team.logo)} style = {{border:"2px solid #707070"}} />
            <Text color = {color}>
                {`${props.picker.first_name} ${props.picker.last_name}`}
            </Text>
            <Text color = {color}>
                {props.team.name}
            </Text>
            <Text color = {color}>
                {`Week: ${props.week.week}`}
            </Text>
        </div>
        </Link>
    )
}