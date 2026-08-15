import UserBox from "../General/UserBox";
import {User} from "../General/Interfaces"
import Text from "../General/Text"
import { useEffect, useState } from "react";
import API from "../Form/API";
import Background from "../Background/Background";
import back from "../images/backgrounds/clarg.jpg"
import "./standing.css"
import { inflate } from "zlib";

interface Props {
    shame?:boolean
}

function getGameStr(user:User) {
    return `${user.win}_${user.loss}_${user.tie}`
}

//standings page
export default function Standings(props:Props) {
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
    //determines if two users have the same standing
    //returns true if they do otherwise false
    function sameStanding(user1:User, user2:User) {
        return (user1.win == user2.win && 
            user1.tie == user2.tie && user1.loss == user2.loss 
            && user1.avg_margin == user2.avg_margin)
    }
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
    let lastId = id;
    let standings_var = [...standings]
    if (props.shame) {
        //remove first entry from list 
        if (standings_var.length > 0) {
            standings_var.shift()
        }
        //reverse list
        for (let i = 0; i < Math.floor(standings_var.length/2); i++) {
            
            let tmp = standings_var[standings_var.length - i - 1];
            standings_var[standings_var.length - i - 1] = standings_var[i];
            standings_var[i] = tmp;
            
        }
    }

    //compute margin gap behind largest margin
    let max_margin:any = {};
    for (let i = 0; i < standings_var.length; i++) {
        let user = standings_var[i];
        user.margin_gap = Math.round((user.win + user.loss + user.tie) * user.avg_margin)
        let game_str = getGameStr(user)
        if (max_margin[game_str] == undefined|| user.margin_gap > max_margin[game_str]) {
            max_margin[game_str] = user.margin_gap
        } 
    }
    for (let i = 0; i < standings_var.length; i++) {
        let user = standings_var[i];
        let game_str = getGameStr(user)
        if (user.margin_gap !== null) {
            user.margin_gap =  max_margin[game_str] - user.margin_gap
        }
    }
    
    return (
        <Background image = {back} title = "Standings">
            
            <div className = "pick-list">
            {standings_var.map(user => {
                let placement = id;
                //calculate place
                //if not first user and users have same standing
                //give them the same place
                if (id > 1 && sameStanding(standings[lastId - 1], user)) {
                    placement = lastId;
                } else {
                    //update lastId to be new id
                    lastId = id
                }
                //increment count
                id++
                return (
                <UserBox key = {id} user = {user}>
                    <Text color = "#505050" size = "2rem">
                        {props.shame?"Hall of Shame":place(placement)}
                    </Text>
                    <Text>
            {`${user.win}-${user.loss}-${user.tie}`}
                    </Text>
                    <Text color = "#909090">
                        {`Avg Margin: ${user.avg_margin}`}
                    </Text>
                    <Text color = "#909090" size="1.25rem">
                        {`Margin Tie Difference: ${user.margin_gap == 0? "Tie Leader":user.margin_gap}`}
                    </Text>
                </UserBox>
            )})}
        </div>
        {!props.shame &&
        <div className = "clicker" onClick = {
            async () => {
                //updates standings by querying server 
                let api = new API("/api/update_standings","get")
                let req = await api.query({})
                if (req.success) {
                    window.location.href = "/standings"
                }
            }
        }>
            <div className = "form-button standing-button">
                Update Standings
            </div>
        </div>
        }
        
        </Background>
        
    )
}