import React, { useEffect, useState } from "react"
import {Input, IFormAttribute, Image} from './Exports'
import API from "./API"
import FormAttribute from './FormAttribute'
import Select from "./Inputs/Select"
interface Props {
    //array of form attributes
    inputs:FormAttribute[],
    //form title
    title:string,
    //api object
    api:API,
    onSuccess():void,
    //auth form
    auth?:boolean,
    children?:any,

}

export default function Form(props:Props) {
    //initialize inputs form variable array
    const [inputs, setInputs] = useState<FormAttribute[]>([...props.inputs]);
    const [error, setError] = useState<string>("");
    useEffect(function() {
        setInputs([...props.inputs])
    }, [props.inputs])
    //create updater functions
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].id = i;
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
        let request = await props.api.query(data, props.auth);
        if (!request.success) {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
            {props.children}
        </div>
    )
}
// export default React.memo(Form);