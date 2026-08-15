import { useEffect, useState } from "react"
import API from "../Form/API"
import { Team } from "../General/Interfaces"
import "./burn.css"

interface TeamRow {
    team:Team,
    //"available" | "burned" | "banned"
    state:string,
    week:number|null,
    result:string|null,
}

interface BurnData {
    year:number,
    current_season:boolean,
    counts:{available:number, burned:number, banned:number},
    teams:TeamRow[],
}

interface Props {
    //a user uuid, or "me" for the logged in user
    userId:string,
    year:string,
}

function Tile(props:{row:TeamRow}) {
    let row = props.row
    return (
        <div className = {`burn-tile is-${row.state}`}
            title = {row.week? `${row.team.name} · week ${row.week}` : row.team.name}>
            <div className = "burn-logo">
                <img src = {API.generateLink(row.team.logo)} alt = {row.team.name} />
            </div>
            <div className = "burn-abrv">{row.team.abrv}</div>
            {row.state === "burned" && row.week !== null &&
                <div className = "burn-badge">{`W${row.week}`}</div>
            }
            {row.state === "banned" &&
                <div className = "burn-badge is-banned">✕</div>
            }
        </div>
    )
}

export default function BurnChart(props:Props) {
    const [data, setData] = useState<BurnData|null>(null)

    useEffect(function() {
        let stale = false
        ;(async function() {
            let api = new API(`/api/burn/${props.userId}/${props.year}`, "get")
            //silent: this widget lives inside the page's <Loading> gate
            let req = await api.query({}, false, true)
            //a slow response for a year you already switched away from
            //should not overwrite the current one
            if (stale) return
            setData(req.success? req.payload : null)
        })()
        return function() { stale = true }
    }, [props.userId, props.year])

    if (!data) {
        return null
    }

    let groups = [
        {key:"available", label:"Still Available", count:data.counts.available},
        {key:"burned", label:"Burned", count:data.counts.burned},
        {key:"banned", label:"Banned", count:data.counts.banned},
    ]

    return (
        <div className = "burn hp-surface">
            <div className = "burn-head">
                <span className = "burn-title">Teams</span>
                <span className = "burn-counts">
                    <span className = "burn-count is-available">
                        {`${data.counts.available} left`}
                    </span>
                    <span className = "burn-count is-burned">
                        {`${data.counts.burned} burned`}
                    </span>
                    {data.counts.banned > 0 &&
                        <span className = "burn-count is-banned">
                            {`${data.counts.banned} banned`}
                        </span>
                    }
                </span>
            </div>

            {groups.map(group => {
                let rows = data.teams.filter(t => t.state === group.key)
                if (rows.length === 0) return null
                return (
                    <div className = "burn-group" key = {group.key}>
                        <div className = "burn-group-label">
                            {`${group.label} · ${group.count}`}
                        </div>
                        <div className = "burn-grid">
                            {rows.map(row => (
                                <Tile key = {row.team.uuid} row = {row} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
