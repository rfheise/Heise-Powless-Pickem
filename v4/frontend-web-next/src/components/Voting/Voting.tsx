"use client";

import { useState } from "react";
import { BackgroundParent } from "../Background/Background";
import API from "@/lib/api";
import Form from "../Form/Form";
import FormAttriubte from "../Form/FormAttribute";
import TeamSelect from "../Form/Inputs/TeamSelect";

export default function Voting() {
  const inputs: FormAttriubte[] = [
    new FormAttriubte("vote1", "Team One", TeamSelect, "Cardinals"),
    new FormAttriubte("vote2", "Team Two", TeamSelect, "Cardinals"),
    new FormAttriubte("vote3", "Team Three", TeamSelect, "Cardinals"),
  ];
  const [success, setSuccess] = useState<Boolean>(false);
  function toggleSuccess() {
    setSuccess((success) => !success);
  }
  return (
    <BackgroundParent
      title="Ban Some Teams"
      heading="Ban Some Teams"
      sub="Pick three nobody should be allowed to ride"
    >
      {!success ? (
        <div className="form-page">
          <Form
            title="Banned Teams"
            inputs={inputs}
            onSuccess={toggleSuccess}
            api={new API("/api/vote", "post")}
          />
        </div>
      ) : (
        <div className="form-page">
          <div className="form">
            <div className="success">
              <span className="success-mark">✓</span>
              Votes Counted
            </div>
          </div>
        </div>
      )}
    </BackgroundParent>
  );
}
