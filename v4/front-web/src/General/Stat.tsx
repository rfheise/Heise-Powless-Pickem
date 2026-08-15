import "./user.css"

interface Props {
    //the big number / value
    value:any,
    //the small caps label under it
    label?:string,
    //"win" | "loss" | "muted" | "lead" | "text"
    tone?:string,
}

//a single stat cell inside a leaderboard row
export default function Stat(props:Props) {
    let className = "hp-stat"
    if (props.tone) {
        className += ` is-${props.tone}`
    }
    return (
        <div className = {className}>
            <div className = "hp-stat-value">{props.value}</div>
            {props.label && <div className = "hp-stat-label">{props.label}</div>}
        </div>
    )
}
