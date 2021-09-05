import { useEffect, useState } from "react";
import Background from "../Background/Background";
import API from "../Form/API";
import {User} from '../General/Interfaces'
import UserBox from "../General/UserBox";
import Text from "../General/Text"
import melody from "../images/melody.png"
interface Vote {
    user:User,
    votes:string,
}

export default function Voting() {
    const [votes, setVotes] = useState<Vote[]>([])
    useEffect(function() {
        (async function() {
            let api = new API("/api/votes", "get");
        })()
    },[])
    return (
        <Background image = {melody} title = "Current Votes">
            {votes.map(vote => (
                <UserBox user = {vote.user}>
                    <Text size = "2rem">
                        {vote.votes}
                    </Text>
                </UserBox>
            ))}
        </Background>
    )
    
}