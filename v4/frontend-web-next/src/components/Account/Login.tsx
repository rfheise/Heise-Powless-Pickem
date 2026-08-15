"use client";

import FormAttribute from "../Form/FormAttribute";
import API from "@/lib/api";
import { BackgroundParent } from "../Background/Background";
import Form from "../Form/Form";
import Text from "../Form/Inputs/Text";
import Password from "../Form/Inputs/Password";

export default function Login() {
  const formElements = [
    new FormAttribute("username", "Username", Text),
    new FormAttribute("password", "Password", Password),
  ];
  function onSuccess() {
    window.location.href = "/";
  }
  const api = new API("/api/login", "post");
  return (
    <BackgroundParent title="Login">
      <div className="form-page">
        <Form
          auth={true}
          onSuccess={onSuccess}
          inputs={formElements}
          title="Login"
          api={api}
        />
      </div>
    </BackgroundParent>
  );
}
