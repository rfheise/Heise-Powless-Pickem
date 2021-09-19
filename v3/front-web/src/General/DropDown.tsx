import Text from "../General/Text"
import "./user.css"

interface DropDown {
    options:string[],
    onChange(week:string):void,
    currentSelection:string,
    title:string,
}


export default function DropDown(props:DropDown) {
    function updater(event:any) {
        props.onChange(event.target.value)
    }
    let key = 0;
    return (
        <div className = "drop-down">
            <div className = "drop-down-title">
                {props.title}
            </div>
            <select className = "drop-down-select" value = {props.currentSelection}
                onChange = {updater}>
                {props.options.map(opt => (
                    <option key = {key++} value = {opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}