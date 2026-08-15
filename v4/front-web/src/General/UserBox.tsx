import { API } from "../Form/Exports"
import {User} from "./Interfaces"
import "./user.css"

interface Props {
    user:User,
    //what sits in the rank slot: a number, a place string, or a word
    rank?:any,
    //style for the rank badge: "1" | "2" | "3" | "word" | undefined
    rankStyle?:string,
    //secondary line under the name
    note?:string,
    //stat cells on the right
    children?:any
}

//default user display — a leaderboard row linking to that user's picks
export default function UserBox(props:Props) {
    let hasRank = (props.rank !== undefined && props.rank !== null)
    let rankClass = "hp-row-rank"
    if (props.rankStyle) {
        rankClass += (props.rankStyle === "word") ? " is-word" : ` is-${props.rankStyle}`
    }
    return (
        <a className = {`hp-row${hasRank ? "" : " is-norank"}`}
            href={`/picks/${props.user.uuid}`}>
            {hasRank &&
                <div className = {rankClass}>{props.rank}</div>
            }
            <div className = "hp-row-avatar">
                <img src = {API.generateLink(props.user.propic)}
                    alt = {`${props.user.first_name} ${props.user.last_name}`} />
            </div>
            <div className = "hp-row-main">
                <div className = "hp-row-name">
                    {`${props.user.first_name} ${props.user.last_name}`}
                </div>
                {props.note && <div className = "hp-row-note">{props.note}</div>}
            </div>
            <div className = "hp-row-stats">
                {props.children}
            </div>
        </a>
    )
}
