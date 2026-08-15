"use client";

import Background from "../Background/Background";
import FormAttribute from "../Form/FormAttribute";
import API from "@/lib/api";
import Form from "../Form/Form";
import Text from "../Form/Inputs/Text";
import Password from "../Form/Inputs/Password";
import Image from "../Form/Inputs/Image";
import Link from "../General/Link";

export default function SignIn() {
  const formElements = [
    new FormAttribute("propic", "Profile Picture", Image),
    new FormAttribute("email", "Email", Text),
    new FormAttribute("username", "Username", Text),
    new FormAttribute("password", "Password", Password),
    new FormAttribute("cpassword", "Confirm Password", Password),
    new FormAttribute("first_name", "First Name", Text),
    new FormAttribute("last_name", "Last Name", Text),
  ];
  function onSuccess() {
    window.location.href = "/";
  }
  const api = new API("/api/signup", "post");
  return (
    <Background title="Sign Up">
      <div className="form-page">
        <Form
          auth={true}
          onSuccess={onSuccess}
          inputs={formElements}
          title="Sign Up"
          api={api}
        >
          <Link route="/login" title="Have An Account? Login" />
        </Form>
      </div>
    </Background>
  );
}
