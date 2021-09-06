import UserBox from "../General/UserBox";
import {User} from "../General/Interfaces"
import Text from "../General/Text"
import { useEffect, useState } from "react";
import API from "../Form/API";
import Background from "../Background/Background";
import back from "../images/christmas.png"


export default function Standings() {
    const [standings, setStandings] = useState<User[]>([])
    //gets initial standings from api
    useEffect(function() {
        (async function() {
            let api = new API("/api/standings", "get")
            let req = await api.query({})
            if (req.success) {
                setStandings(req.payload)
            }
        })()
    }, [])
    //convert number to string place
    function place(number:number) {
        if (number % 100 == 11) {
            return `${number}th`
        } else if (number % 100 == 12) {
            return `${number}th`
        } else if (number % 100 == 13) {
            return `${number}th`
        } else if (number % 10 == 1) {
            return `${number}st`
        } else if (number % 10 == 2) {
            return `${number}nd`
        } else if (number % 10 == 3) {
            return `${number}rd`
        } else {
            return `${number}th`
        }
    }
    let id = 1
    return (
        <Background image = {back} title = "Standings">
            <div className = "pick-list">
            {standings.map(user => (
                <UserBox key = {id} user = {user}>
                    <Text color = "#505050" size = "2rem">
                        {place(id++)}
                    </Text>
                    <Text>
            {`${user.win}-${user.loss}-${user.tie}`}
                    </Text>
                </UserBox>
            ))}
        </div>
        </Background>
        
    )
}