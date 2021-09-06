import Text from "../General/Text"
import {Team, User, Week} from "../General/Interfaces"
import Propic from "../General/Propic"
import API from "../Form/API"

export interface PickInterface {
    picker:User,
    team:Team,
    week:Week
}

export default function Pick(props:PickInterface) {
    return (
        <div className = "user-box">
            <Propic image = {API.generateLink(props.team.logo)} style = {{border:"2px solid #707070"}} />
            <Text>
                {`${props.picker.first_name} ${props.picker.last_name}`}
            </Text>
            <Text>
                {props.team.name}
            </Text>
            <Text>
                {`Week: ${props.week.week}`}
            </Text>
        </div>
    )
}