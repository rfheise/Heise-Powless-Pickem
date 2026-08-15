import "./pick.css"
import Pick from "./Pick"
import {PickInterface} from "./Pick"
import { useEffect, useState } from "react"
import API from "../Form/API"
import back from "../images/ramsey.png"
import Background from "../Background/Background"
import PickPage from "./PickCoalese"

export default function MyPicks() {
  
    return (
        <PickPage route = {"/api/mypicks"} />
    )
}