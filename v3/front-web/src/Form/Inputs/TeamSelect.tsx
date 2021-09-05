import { API } from "../Exports"
import Input from "./Input"


export default class TeamSelect extends Input {
    static teams:string[] = ['Cardinals', 'Falcons', 'Ravens', 'Bills', 'Panthers', 'Bears', 'Bengals', 'Browns', 'Cowboys', 'Broncos', 'Lions', 'Packers', 'Texans', 'Colts', 'Jaguars', 'Chiefs', 'Raiders', 'Rams', 'Chargers', 'Dolphins', 'Vikings', 'Patriots', 'Saints', 'Giants', 'Jets', 'Eagles', 'Steelers', '49ers', 'Seahawks', 'Buccaneers', 'Titans', 'Washington']
    render() {
        let id = 0
        return (
            <div className = "form-input">
                <div className = "input-title">
                    {this.props.title}
                </div>
                <div className = "select-wrapper">
                <select className = "team-select" value = {this.props.value} onChange = {this.update.bind(this)}>
                    {TeamSelect.teams.map(teams => 
                        (<option key = {id++} value = {teams}>{teams}</option>))}
                </select>
                </div>
            </div>
        )
    }
}