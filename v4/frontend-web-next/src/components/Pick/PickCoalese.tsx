"use client";

import Pick from "./Pick";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import Background from "../Background/Background";
import { current_year } from "@/lib/config";
import DropDown from "../General/DropDown";
import BurnChart from "../Teams/BurnChart";
import { PickInterface } from "@/lib/types";

interface Props {
  route: string;
  //a user uuid, or "me" for the logged in user
  userId: string;
}

//These picks are behind the api token, which only the browser has, so this
//page still fetches on mount exactly as it did before.
export default function PickPage({ route, userId }: Props) {
  const [picks, setPicks] = useState<PickInterface[]>([]);
  const [year, setYear] = useState<string>(current_year.toString());
  useEffect(
    function () {
      (async function () {
        let api = new API(route, "get");
        let req = await api.query({ year: year });
        if (req.success) {
          setPicks(req.payload);
        }
      })();
    },
    [year],
  );

  let years = [];
  for (let i = 2015; i <= current_year; i++) {
    years.push(i.toString());
  }
  //the header reads off whose picks these are
  let owner = picks.length > 0 ? picks[0].picker : null;
  let heading = owner ? `${owner.first_name} ${owner.last_name}` : "Picks";
  return (
    <Background title="My Picks" heading={heading} sub={`${year} Season`}>
      <div className="hp-page">
        <div className="hp-filters">
          <DropDown
            title="Year"
            currentSelection={year}
            options={years}
            onChange={(year: string) => {
              setYear(year);
            }}
          />
        </div>
        <BurnChart userId={userId} year={year} />
        {picks.length > 0 && (
          <div className="hp-list">
            {picks.map((pick) => (
              <Pick key={`${pick.week.week}${pick.week.year}`} {...pick} />
            ))}
          </div>
        )}
        {picks.length === 0 && <div className="error">No Picks Yet</div>}
      </div>
    </Background>
  );
}
