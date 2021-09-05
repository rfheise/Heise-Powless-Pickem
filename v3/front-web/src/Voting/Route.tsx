import { useState } from "react";
import Background from "../Background/Background";
import API from "../Form/API";
import Form from "../Form/Form";
import FormAttriubte from "../Form/FormAttribute";
import background from "./background.png"
import TeamSelect from "../Form/Inputs/TeamSelect"

export default function Voting() {
    const inputs:FormAttriubte[] = [
        new FormAttriubte("vote1","Team One", TeamSelect, "Cardinals"),
        new FormAttriubte("vote2","Team Two", TeamSelect, "Cardinals"),
        new FormAttriubte("vote3","Team Three", TeamSelect, "Cardinals")
    ]
    const [success, setSuccess] = useState<Boolean>(false);
    function toggleSuccess() {
        setSuccess(success => (!success))
    }
    return (
        <Background title = "Ban Some Teams" image = {background}>
            {!success?
                <div className = "form-page">
                    <Form title = "Banned Teams" 
                    inputs = {inputs} onSuccess = {toggleSuccess}
                    api = {new API("/api/vote","post")}
                    />
                </div>
            :
            <div className = "form-page">
                <div className = "form">
                    <div className = "success">
                        Success
                    </div>
                </div>
            </div>
            }
        </Background>
        
    ) 
}