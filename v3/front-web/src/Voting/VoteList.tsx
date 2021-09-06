import { useEffect, useState } from "react";
import Background from "../Background/Background";
import API from "../Form/API";
import {User, Team} from '../General/Interfaces'
import UserBox from "../General/UserBox";
import Text from "../General/Text"
import melody from "../images/melody.png"
import "./votes.css"
interface Vote {
    user:User,
    votes:string,
}

export default function Voting() {
    const [votes, setVotes] = useState<Vote[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    useEffect(function() {
        (async function() {
            let api = new API("/api/votes", "get");
            let req = await api.query({})
            if (req.payload) {
                setVotes(req.payload.picks)
                setTeams(req.payload.teams)
            }
        })()
    },[])
    return (
        <Background image = {melody} title = "Current Votes">
            <div className = "hof">
            <div className = "user-box">
                <Text size = "2rem" color = "#505050">
                    Currently Leading
                </Text>
                {teams.map(team => (
                    <Text> {team.name} </Text>
                ))}
            </div>
            {votes.map(vote => (
                <UserBox user = {vote.user}>
                    <Text size = "2rem">
                        {vote.votes}
                    </Text>
                </UserBox>
            ))}
            </div>
        </Background>
    )
    
}