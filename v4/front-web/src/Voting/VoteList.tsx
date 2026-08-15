import { useEffect, useState } from "react";
import Background from "../Background/Background";
import API from "../Form/API";
import {User, Team} from '../General/Interfaces'
import UserBox from "../General/UserBox";
import Stat from "../General/Stat";
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
    let id = 0;
    return (
        <Background title = "Current Votes" sub = "Who's getting banned">
            <div className = "hp-page">
                <div className = "vote-leaders hp-surface">
                    <div className = "vote-leaders-title">
                        {teams.length > 0? "Currently Leading" : "No Votes Yet"}
                    </div>
                    {teams.length > 0 &&
                        <div className = "vote-chips">
                            {teams.map(team => (
                                <div className = "vote-chip" key = {team.uuid}>{team.name}</div>
                            ))}
                        </div>
                    }
                </div>
                {votes.length > 0 &&
                    <div className = "hp-list">
                        <div className = "hp-list-head">
                            <span>Ballots</span>
                            <span>{`${votes.length} ${votes.length === 1? "vote" : "votes"}`}</span>
                        </div>
                        {votes.map(vote => (
                            <UserBox key = {id++} user = {vote.user}>
                                <Stat tone = "text" label = "Voted To Ban" value = {vote.votes} />
                            </UserBox>
                        ))}
                    </div>
                }
            </div>
        </Background>
    )

}
