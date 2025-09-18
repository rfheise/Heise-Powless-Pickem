//takes in options and returns select
import { Input } from "../Exports";

//can be used in default form
export default function Select(options:any[]) {
    return class extends Input {
        render() {
            let id = 0;
            return (
                <div className = "form-input">
                <div className = "input-title">
                    {this.props.title}
                </div>
                <div className = "select-wrapper">
                <select className = "team-select" value = {this.props.value} onChange = {this.update.bind(this)}>
                    {options.map(opt => 
                        (<option key = {id++} value = {opt}>{opt}</option>))}
                </select>
                </div>
            </div>
            )
        }
    }
}