import { Link } from "react-router-dom"
import { API } from "../Form/Exports"
import {User} from "./Interfaces"
import Propic from "./Propic"
import Text from "./Text"
import "./user.css"

interface Props {
    user:User,
    children?:any
}
//default user display
export default function UserBox(props:Props) {
    return (
        <a style = {{textDecoration:"none"}} href={`/picks/${props.user.uuid}`}>
        <div className = "user-box">
            <Propic image = {API.generateLink(props.user.propic)} 
                style = {{border:"2px solid #707070"}}/>
            <Text>
                {`${props.user.first_name} ${props.user.last_name}`}
            </Text>
            {props.children}
        </div>
        </a>
    )
}   