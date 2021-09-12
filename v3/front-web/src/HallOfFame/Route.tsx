import Background from "../Background/Background";
import HofBox from "./HofBox"
import {User} from "../General/Interfaces"
import { useEffect, useState } from "react";
import API from "../Form/API";
import "./hof.css"

//hall of fame interface
export interface Hof {
    user:User,
    record:string,
    year:number 
}

interface Props {

}

export default function HallOfFame() {
    const [hofs, setHofs] = useState<Hof[]>([]);

    useEffect(function() {
        (async function(){
            let api = new API("/api/hof","get");
            let req = await api.query({});
            if (req.success) {
                setHofs(req.payload);
            }
        })()
    }, []) 
    let id = 0;
    return (
        <Background title = "Hall of Fame">
            <div className = "hof">
                {hofs.map(hof => (
                    <HofBox key = {id++} {...hof} />
                ))}
            </div>
        </Background>
    )
}