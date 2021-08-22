import Background from '../Background/Background'
import lexi from "../images/chain.png"
import { Form, Text,FormAttribute,API, Password, Image } from '../Form/Exports';
import { useState } from 'react';
import "../Form/form.css"

export default function SignIn () {
    const formElements = [
        new FormAttribute("image", "Profile Picture", Image),
        new FormAttribute("email","Email",Text),
        new FormAttribute("uname", "Username", Text),
        new FormAttribute("pword","Password", Password),
        new FormAttribute("cpword","Confirm Password", Password),
        new FormAttribute("fname", "First Name", Text),
        new FormAttribute("lname", "Last Name", Text)
    ]
    const api = new API("/api/signup","post");
    return (
        <Background title = "Sign Up" image = {lexi}>
            <div className = "form-page">
                <Form inputs = {formElements} title = "Sign Up" api = {api}/>
            </div>
           
        </Background>
    )
}