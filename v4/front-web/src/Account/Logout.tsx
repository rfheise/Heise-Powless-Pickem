import { useEffect } from "react"
import API from "../Form/API"




//calls logout api
export default function Logout() {
    useEffect(function( ){
        (async function() {
            let api = new API("/api/logout","get")
            let req = await api.query({}, false);
            window.localStorage.setItem("token","")
            window.location.href = "/login"
        })()
    }, []) 
    return (
        <div>

        </div>
    )
}