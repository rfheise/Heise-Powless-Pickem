import FormAttribute from "../Form/FormAttribute"
import API from "../Form/API"
import Background, { BackgroundParent }  from "../Background/Background";
import {Form, Image} from "../Form/Exports"
import lexi from "../images/dunce.png"
import Link from "../General/Link";
import {useState} from 'react';


export default function ProPic () {
    const [success, setSuccess] = useState<boolean>(false)
    const formElements = [
        new FormAttribute("image", "Profile Picture", Image),
    ]
    function onSuccess(){
        setSuccess(true)
    }
    const api = new API("/api/propic","post");
    if(success) {
        return (
            <BackgroundParent title = "Login">
        <div className = "form-page">
            <div className = "form">
                <div className = "success">
                    Success
                </div>
            </div>
        </div>
        </BackgroundParent>
        )
    }
    return (
        <BackgroundParent title = "Login">
            <div className = "form-page">
                <Form auth = {true} onSuccess = {onSuccess} inputs = {formElements} title = "Change Pic" api = {api}>
                {/* <Link route = "/signup" title = "Need An Account? Sign Up" /> */}
                </Form>
                 
            </div>
           
        </BackgroundParent>
    )
}