import API from "../Form/API"
import { Player, Season, TeamStat } from "./Route"
import { place, signed } from "../General/format"
import "./career.css"

interface Props {
    player:Player,
}

function TeamLine(props:{stat:TeamStat, tone?:string}) {
    let s = props.stat
    return (
        <div className = "career-team">
            <div className = "career-team-logo">
                <img src = {API.generateLink(s.team.logo)} alt = {s.team.name} />
            </div>
            <div className = "career-team-name">{s.team.name}</div>
            <div className = "career-team-count">{`${s.count}×`}</div>
            <div className = {`career-team-record${props.tone? ` is-${props.tone}` : ""}`}>
                {`${s.wins}-${s.loss}${s.ties > 0? `-${s.ties}` : ""}`}
            </div>
        </div>
    )
}

export default function CareerDetail({player}:Props) {
    let ex = player.extremes
    return (
        <div className = "career-detail">

            {/* --- career highs and lows --- */}
            <div className = "career-extremes">
                <div className = "career-extreme">
                    <div className = "career-extreme-label">Best Season</div>
                    <div className = "career-extreme-value">
                        {ex.best? ex.best.year : "—"}
                    </div>
                    {ex.best &&
                        <div className = "career-extreme-note">
                            {`${ex.best.wins}-${ex.best.loss}-${ex.best.ties} · ${place(ex.best.finish)}`}
                        </div>
                    }
                </div>
                <div className = "career-extreme">
                    <div className = "career-extreme-label">Worst Season</div>
                    <div className = "career-extreme-value">
                        {ex.worst? ex.worst.year : "—"}
                    </div>
                    {ex.worst &&
                        <div className = "career-extreme-note">
                            {`${ex.worst.wins}-${ex.worst.loss}-${ex.worst.ties} · ${place(ex.worst.finish)}`}
                        </div>
                    }
                </div>
                <div className = "career-extreme">
                    <div className = "career-extreme-label">Longest Streak</div>
                    <div className = "career-extreme-value">
                        {ex.streak.length > 0? `${ex.streak.length}` : "—"}
                    </div>
                    {ex.streak.length > 0 &&
                        <div className = "career-extreme-note">
                            {`${ex.streak.start} → ${ex.streak.end}`}
                        </div>
                    }
                </div>
            </div>

            <div className = "career-columns">

                {/* --- season by season --- */}
                <div className = "career-panel">
                    <div className = "career-panel-title">Season By Season</div>
                    <div className = "career-seasons">
                        <div className = "career-season is-head">
                            <span>Year</span><span>Record</span><span>Avg</span><span>Finish</span>
                        </div>
                        {player.seasons.map((s:Season) => (
                            <div className = {`career-season${s.champion? " is-champion" : ""}`}
                                key = {s.year}>
                                <span className = "career-season-year">
                                    {s.year}{s.champion && <span className = "career-trophy">🏆</span>}
                                </span>
                                <span className = "hp-num">{`${s.wins}-${s.loss}-${s.ties}`}</span>
                                <span className = "hp-num career-season-avg">{signed(s.avg_margin)}</span>
                                <span className = "hp-num">{place(s.finish)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- teams --- */}
                <div className = "career-panel">
                    <div className = "career-panel-title">Most Picked</div>
                    <div className = "career-teams">
                        {player.teams.most.map(stat => (
                            <TeamLine key = {stat.team.uuid} stat = {stat} />
                        ))}
                    </div>

                    {player.teams.unluckiest &&
                        <>
                            <div className = "career-panel-title is-spaced">Let Them Down Most</div>
                            <div className = "career-teams">
                                <TeamLine stat = {player.teams.unluckiest} tone = "loss" />
                            </div>
                        </>
                    }

                    {player.teams.never.length > 0 &&
                        <>
                            <div className = "career-panel-title is-spaced">
                                {`Never Picked · ${player.teams.never.length}`}
                            </div>
                            <div className = "career-never">
                                {player.teams.never.map(team => (
                                    <span className = "career-never-chip" key = {team.uuid}>
                                        {team.abrv}
                                    </span>
                                ))}
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
