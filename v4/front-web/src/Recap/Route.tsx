import { useEffect, useRef, useState } from "react"
import Background from "../Background/Background"
import API from "../Form/API"
import DropDown from "../General/DropDown"
import { current_year } from "../Pick/WeeklyPicks"
import { User, Team, Week } from "../General/Interfaces"
import AwardCard from "./AwardCard"
import { place } from "../General/format"
import "./recap.css"

//one pick that won an award
export interface AwardPick {
    user:User,
    team:Team,
    margin:number,
    result:string,
    score:string,
}

export interface Herd {
    team:Team,
    count:number,
    wins:number,
    loss:number,
    ties:number,
}

interface Movement {
    user:User,
    rank_before:number|null,
    rank_after:number|null,
    delta:number,
    record:string,
}

interface RecapData {
    week:Week,
    scoreboard:{players:number, wins:number, loss:number, ties:number, pending:number},
    awards:{
        blowout:AwardPick|null,
        squeaker:AwardPick|null,
        worst_beat:AwardPick|null,
        lone_wolf:AwardPick|null,
        herd:Herd|null,
    },
    movement:Movement[],
}

export default function Recap() {
    const [recap, setRecap] = useState<RecapData|null>(null)
    const [week, setWeek] = useState<string>("")
    const [year, setYear] = useState<string>("")
    //the week we last fetched, so settling on the latest week from the server
    //does not immediately refetch that same week
    const loaded = useRef<string>("")

    //grab the recap for the selected week
    async function getRecap(w:string, y:string) {
        let key = `${w}-${y}`
        if (loaded.current === key) return
        loaded.current = key
        let api = new API(`/api/recap/week/${w}/${y}`, "get")
        let req = await api.query({})
        setRecap(req.success? req.payload : null)
    }
    //open on the most recently completed week rather than the week the season
    //is currently on, which typically has nothing played yet
    async function loadLatest() {
        let api = new API("/api/recap/latest", "get")
        let req = await api.query({})
        if (req.success) {
            let w = "" + req.payload.week.week
            let y = "" + req.payload.week.year
            loaded.current = `${w}-${y}`
            setRecap(req.payload)
            setWeek(w)
            setYear(y)
        } else {
            //nothing has been played yet - fall back to week 1 of this season
            setWeek("1")
            setYear(current_year.toString())
        }
    }
    useEffect(function() {
        if (week === "" || year === "") {
            loadLatest()
        } else {
            getRecap(week, year)
        }
    }, [week, year])

    let weeks:string[] = []
    for (let i = 1; i <= 18; i++) {
        weeks.push(i.toString())
    }
    let years:string[] = []
    for (let i = 2015; i <= current_year; i++) {
        years.push(i.toString())
    }

    let board = recap ? recap.scoreboard : null
    //a week nobody has played yet has nothing to recap
    let settled = board ? (board.players - board.pending) : 0
    let awards = recap ? recap.awards : null
    let movers = recap ? recap.movement.filter(m => m.delta !== 0) : []

    return (
        <Background title = "Weekly Recap"
            sub = {(week && year)? `Week ${week} · ${year}` : undefined}>
            <div className = "hp-page">
                <div className = "hp-filters">
                    <DropDown title = "Week" currentSelection = {week}
                        options = {weeks}
                        onChange = {(w:string) => {setWeek(w)}} />
                    <DropDown title = "Year" currentSelection = {year}
                        options = {years}
                        onChange = {(y:string) => {setYear(y)}} />
                </div>

                {board && settled > 0 &&
                    <div className = "recap-board hp-surface">
                        <div className = "recap-board-line">
                            <span className = "recap-board-value hp-num">
                                {`${board.wins}-${board.loss}-${board.ties}`}
                            </span>
                            <span className = "recap-board-label">The Week</span>
                        </div>
                        <div className = "recap-board-tallies">
                            <span className = "recap-tally is-win">{`${board.wins} won`}</span>
                            <span className = "recap-tally is-loss">{`${board.loss} lost`}</span>
                            {board.ties > 0 &&
                                <span className = "recap-tally">{`${board.ties} tied`}</span>}
                            {board.pending > 0 &&
                                <span className = "recap-tally">{`${board.pending} still to play`}</span>}
                        </div>
                    </div>
                }

                {awards && settled > 0 &&
                    <div className = "recap-awards">
                        <AwardCard icon = "💥" title = "Biggest Blowout"
                            pick = {awards.blowout} />
                        <AwardCard icon = "😬" title = "Closest Call"
                            pick = {awards.squeaker} />
                        <AwardCard icon = "💀" title = "Worst Beat"
                            pick = {awards.worst_beat} />
                        <AwardCard icon = "🐺" title = "Lone Wolf"
                            pick = {awards.lone_wolf}
                            note = "Only one who took them, and it paid" />
                        {awards.herd &&
                            <AwardCard icon = "🐑" title = "The Herd"
                                herd = {awards.herd} />
                        }
                    </div>
                }

                {movers.length > 0 &&
                    <div className = "hp-list">
                        <div className = "hp-list-head">
                            <span>Standings Movement</span>
                            <span>{`after week ${week}`}</span>
                        </div>
                        {movers.map(m => (
                            <a className = "hp-row is-norank recap-mover"
                                key = {m.user.uuid} href = {`/picks/${m.user.uuid}`}>
                                <div className = "hp-row-avatar">
                                    <img src = {API.generateLink(m.user.propic)}
                                        alt = {`${m.user.first_name} ${m.user.last_name}`} />
                                </div>
                                <div className = "hp-row-main">
                                    <div className = "hp-row-name">
                                        {`${m.user.first_name} ${m.user.last_name}`}
                                    </div>
                                    <div className = "hp-row-note">{m.record}</div>
                                </div>
                                <div className = "hp-row-stats">
                                    <div className = "hp-stat">
                                        <div className = "hp-stat-value">
                                            {`${place(m.rank_before as number)} → ${place(m.rank_after as number)}`}
                                        </div>
                                        <div className = "hp-stat-label">Moved</div>
                                    </div>
                                    <div className = {`recap-delta ${m.delta > 0? "is-up" : "is-down"}`}>
                                        {`${m.delta > 0? "▲" : "▼"} ${Math.abs(m.delta)}`}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                }

                {recap && settled === 0 &&
                    <div className = "hp-empty">Nothing Played Yet</div>
                }
                {!recap && week !== "" &&
                    <div className = "hp-empty">No Recap For This Week</div>
                }
            </div>
        </Background>
    )
}
