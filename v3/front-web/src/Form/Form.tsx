import React, { useEffect, useState } from "react"
import {Input, IFormAttribute, Image} from './Exports'
import API from "./API"
import FormAttribute from './FormAttribute'
interface Props {
    //array of form attributes
    inputs:FormAttribute[],
    //form title
    title:string,
    //api object
    api:API,
    onSuccess():void

}

function Form(props:Props) {
    //make inputs non read only
    let inputBuffer = [...props.inputs]
    //initiaize id's when component mounts
    for (let i = 0; i < inputBuffer.length; i++) {
        inputBuffer[i].id = i;
    }
    //initialize inputs form variable array
    const [inputs, setInputs] = useState<FormAttribute[]>(inputBuffer);
    const [error, setError] = useState<string>("");
    //create updater functions
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].update = function(value:any) {
            let attribute = FormAttribute.copyConstructor(inputs[i]);
            attribute.value = value;
            let buffer = [...inputs]
            buffer[i] = attribute;
            setInputs(buffer)
            setError("");
        }
    }
    async function submit() {
        let data = inputs.reduce(FormAttribute.jsonReducer, {});
        console.log(data);
        let request = await props.api.query(data);
        if (!request.success) {
            setError(request.payload)
        } else {
            props.onSuccess();
        }
    }
    return (
        <div className = "form">
            <div className = "form-header">
                {props.title}
            </div>
            {error && 
                <div className = "form-error">
                    {error}
                </div>
            }
            <div className = "form-inputs">
                {inputs.map((input) => {
                    return (
                        <div key = {input.id}>
                            <input.component  title = {input.title} 
                        value = {input.value} update = {input.update} />
                        </div>
                    )
                })}
            </div>
            <div className = "form-button" onClick = {submit}>
               Submit
            </div>
        </div>
    )
}
export default React.memo(Form);