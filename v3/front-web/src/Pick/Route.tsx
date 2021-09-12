import { BackgroundParent } from "../Background/Background";
import { API, Text } from "../Form/Exports";
import Form from "../Form/Form";
import FormAttriubte from "../Form/FormAttribute";
import powless from "../images/bama.png"
import "./pick.css"
import {Team} from "../General/Interfaces"
import { useEffect, useState } from "react";
import Select from "../Form/Inputs/Select";

export default function Pick() {
    const [teams, setTeams] = useState<Team[]>([])
    const [success, setSuccess] = useState(false);
    useEffect(function() {
        (async function() {
            let api = new API("/api/get_picks", "get");
            let req = await api.query({})
            if (req.success) {
                setTeams(req.payload.teams)
            }
        })()
    },[])
    let teamList = teams.map(team => (team.name));
    let inputs = [
        new FormAttriubte("team","Select Team", Select(teamList), 
            (teamList.length > 0)? teamList[0]: "")
    ]
    let api = new API("/api/pick", "post")
    return (
        <BackgroundParent title = "Make A Pick">
            <div className = "make-pick">
            {!success ?
                
                <Form inputs = {inputs} title = "Make A Pick" 
                    api = {api} onSuccess = {() => {setSuccess(success => (!success))}}/>
                :
                <div className = "form">
                    <div className = "success">
                        Success
                    </div>
                    
                </div>

            }
            </div>
            
            
        </BackgroundParent>
        
    )
}