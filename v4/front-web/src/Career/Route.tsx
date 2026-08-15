import { useEffect, useState } from "react"
import Background from "../Background/Background"
import API from "../Form/API"
import { User, Team } from "../General/Interfaces"
import CareerDetail from "./CareerDetail"
import "./career.css"

export interface Season {
    year:number,
    wins:number,
    loss:number,
    ties:number,
    avg_margin:number,
    win_pct:number,
    finish:number|null,
    champion:boolean,
}

export interface TeamStat {
    team:Team,
    count:number,
    wins:number,
    loss:number,
    ties:number,
}

export interface Player {
    user:User,
    wins:number,
    loss:number,
    ties:number,
    win_pct:number,
    avg_margin:number,
    picks:number,
    seasons_played:number,
    titles:number[],
    seasons:Season[],
    teams:{most:TeamStat[], unluckiest:TeamStat|null, never:Team[]},
    extremes:{best:Season|null, worst:Season|null,
        streak:{length:number, start:string|null, end:string|null}},
}

export default function Career() {
    const [players, setPlayers] = useState<Player[]>([])
    const [open, setOpen] = useState<string>("")

    useEffect(function() {
        (async function() {
            let api = new API("/api/career", "get")
            let req = await api.query({})
            if (req.success) {
                setPlayers(req.payload.players)
            }
        })()
    }, [])

    function toggle(uuid:string) {
        setOpen(current => (current === uuid? "" : uuid))
    }

    let rank = 0
    return (
        <Background title = "All Time" sub = "Every season on record">
            <div className = "hp-page">
                {players.length > 0 &&
                    <div className = "hp-list">
                        <div className = "hp-list-head">
                            <span>All Time</span>
                            <span>{`${players.length} players`}</span>
                        </div>
                        {players.map(player => {
                            rank++
                            let expanded = (open === player.user.uuid)
                            let rankClass = "hp-row-rank"
                            if (rank <= 3) rankClass += ` is-${rank}`
                            return (
                                <div className = "career-block" key = {player.user.uuid}>
                                    <button
                                        className = {`hp-row career-row${expanded? " is-open" : ""}`}
                                        aria-expanded = {expanded}
                                        onClick = {() => toggle(player.user.uuid)}>
                                        <div className = {rankClass}>{rank}</div>
                                        <div className = "hp-row-avatar">
                                            <img src = {API.generateLink(player.user.propic)}
                                                alt = {`${player.user.first_name} ${player.user.last_name}`} />
                                        </div>
                                        <div className = "hp-row-main">
                                            <div className = "hp-row-name">
                                                {`${player.user.first_name} ${player.user.last_name}`}
                                                {player.titles.map(year => (
                                                    <span className = "career-trophy"
                                                        key = {year} title = {`${year} champion`}>🏆</span>
                                                ))}
                                            </div>
                                            <div className = "hp-row-note">
                                                {`${player.seasons_played} ${player.seasons_played === 1? "season" : "seasons"} · ${player.picks} picks`}
                                            </div>
                                        </div>
                                        <div className = "hp-row-stats">
                                            <div className = "hp-stat">
                                                <div className = "hp-stat-value">
                                                    {`${player.wins}-${player.loss}-${player.ties}`}
                                                </div>
                                                <div className = "hp-stat-label">Record</div>
                                            </div>
                                            <div className = "hp-stat">
                                                <div className = "hp-stat-value">{`${player.win_pct}%`}</div>
                                                <div className = "hp-stat-label">Win Rate</div>
                                            </div>
                                            <div className = "hp-stat is-muted">
                                                <div className = "hp-stat-value">
                                                    {player.avg_margin > 0? `+${player.avg_margin}` : player.avg_margin}
                                                </div>
                                                <div className = "hp-stat-label">Avg Margin</div>
                                            </div>
                                            <span className = {`career-caret${expanded? " is-open" : ""}`} />
                                        </div>
                                    </button>
                                    {expanded && <CareerDetail player = {player} />}
                                </div>
                            )
                        })}
                    </div>
                }
                {players.length === 0 &&
                    <div className = "hp-empty">No History Yet</div>
                }
            </div>
        </Background>
    )
}
