import FormAttribute from "../Form/FormAttribute"
import API from "../Form/API"
import Background  from "../Background/Background";
import {Form, Text, Password} from "../Form/Exports"
import lexi from "../images/dunce.png"
import Link from "../General/Link";
export default function Login () {
    const formElements = [
        // new FormAttribute("image", "Profile Picture", Image),
        new FormAttribute("username", "Username", Text),
        new FormAttribute("password","Password", Password)
    ]
    function onSuccess(){
        window.location.href = "/"
    }
    const api = new API("/api/login","post");
    return (
        <Background title = "Login" image = {lexi}>
            <div className = "form-page">
                <Form auth = {true} onSuccess = {onSuccess} inputs = {formElements} title = "Login" api = {api}>
                <Link route = "/signup" title = "Need An Account? Sign Up" />
                </Form>
                
            </div>
           
        </Background>
    )
}