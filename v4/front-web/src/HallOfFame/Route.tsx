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
        <Background title = "Hall of Fame" sub = "Every champion, every season">
            <div className = "hp-page">
                {hofs.length > 0 &&
                    <div className = "hp-list">
                        <div className = "hp-list-head">
                            <span>Champions</span>
                            <span>{`${hofs.length} ${hofs.length === 1? "banner" : "banners"}`}</span>
                        </div>
                        {hofs.map(hof => (
                            <HofBox key = {id++} {...hof} />
                        ))}
                    </div>
                }
                {hofs.length === 0 &&
                    <div className = "hp-empty">No Champions Yet</div>
                }
            </div>
        </Background>
    )
}
