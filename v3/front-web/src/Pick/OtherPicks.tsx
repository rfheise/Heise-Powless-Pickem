import { useEffect, useState } from 'react'
import Background from '../Background/Background'
import Pick, {PickInterface} from './Pick'
import back from "../images/melodyp2.png"
import {useLocation} from 'react-router-dom';
import API from '../Form/API';

export default function OtherPicks({history, match}:any) {
    const [picks, setPicks] = useState<PickInterface[]>([])
    const {state} = useLocation();
    useEffect(function() {
        (async function() {
            let api = new API(`/api/picks/${state}`, "get");
            let req = await api.query({})
            if (req.success) {
                setPicks(req.payload)
            }
        })()
    }, [])
    return (
        <Background title = 'Picks'>
            <div className = "pick-list">
                {picks?.map(pick => (<Pick {...pick} />))}
                {(picks.length === 0) &&
                    <div className = "error">
                        No Picks Yet
                    </div>
                }
            </div>
        </Background>
    )
}