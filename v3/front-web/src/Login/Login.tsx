import FormAttribute from "../Form/FormAttribute"
import API from "../Form/API"
import Background  from "../Background/Background";
import {Form, Text, Password} from "../Form/Exports"
import lexi from "../images/dunce.png"
export default function Login () {
    const formElements = [
        // new FormAttribute("image", "Profile Picture", Image),
        new FormAttribute("uname", "Username", Text),
        new FormAttribute("pword","Password", Password)
    ]
    function onSuccess(){
        window.location.href = "/"
    }
    const api = new API("/api/login","post");
    return (
        <Background title = "Login" image = {lexi}>
            <div className = "form-page">
                <Form onSuccess = {onSuccess} inputs = {formElements} title = "Login" api = {api}/>
            </div>
           
        </Background>
    )
}