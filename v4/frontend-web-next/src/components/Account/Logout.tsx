"use client";

import { useEffect } from "react";
import API from "@/lib/api";

//calls logout api
export default function Logout() {
  useEffect(function () {
    (async function () {
      let api = new API("/api/logout", "get");
      let req = await api.query({}, false);
      window.localStorage.setItem("token", "");
      window.location.href = "/login";
    })();
  }, []);
  return <div></div>;
}
