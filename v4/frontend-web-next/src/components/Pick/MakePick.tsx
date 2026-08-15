"use client";

import { useEffect, useState } from "react";
import { BackgroundParent } from "../Background/Background";
import API from "@/lib/api";
import Form from "../Form/Form";
import FormAttriubte from "../Form/FormAttribute";
import Select from "../Form/Inputs/Select";
import { Team } from "@/lib/interfaces";

export default function Pick() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [success, setSuccess] = useState(false);
  useEffect(function () {
    (async function () {
      let api = new API("/api/get_picks", "get");
      let req = await api.query({});
      if (req.success) {
        setTeams(req.payload.teams);
      }
    })();
  }, []);
  let teamList = teams.map((team) => team.name);
  let inputs = [
    new FormAttriubte(
      "team",
      "Select Team",
      Select(teamList),
      teamList.length > 0 ? teamList[0] : "",
    ),
  ];
  let api = new API("/api/pick", "post");
  return (
    <BackgroundParent
      title="Make A Pick"
      heading="Make A Pick"
      sub="One team, once a season"
    >
      <div className="form-page">
        {!success ? (
          <Form
            inputs={inputs}
            title="This Week's Pick"
            api={api}
            onSuccess={() => {
              setSuccess((success) => !success);
            }}
          />
        ) : (
          <div className="form">
            <div className="success">
              <span className="success-mark">✓</span>
              Pick Locked In
            </div>
          </div>
        )}
      </div>
    </BackgroundParent>
  );
}
