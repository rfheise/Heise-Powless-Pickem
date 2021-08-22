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
    const api = new API("/api/login","post");
    return (
        <Background title = "Login" image = {lexi}>
            <div className = "form-page">
                <Form inputs = {formElements} title = "Login" api = {api}/>
            </div>
           
        </Background>
    )
}