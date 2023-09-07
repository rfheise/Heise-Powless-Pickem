import { useEffect, useState } from 'react'
import Background from '../Background/Background'
import Pick, {PickInterface} from './Pick'
import back from "../images/melodyp2.png"
import {useLocation} from 'react-router-dom';
import API from '../Form/API';
import PickPage from './PickCoalese';

export default function OtherPicks({history, match}:any) {

    const {state} = useLocation();

    return (
        <PickPage route = {`/api/picks/${state}`} />
    )
}