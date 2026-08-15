"use client";

import { useState } from "react";
import Background from "../Background/Background";
import { Player } from "@/lib/types";
import CareerDetail from "./CareerDetail";
import { Propic } from "../General/Avatar";

interface Props {
  //fetched on the server - there is no loading pass on this page any more
  players: Player[];
}

export default function CareerView({ players }: Props) {
  const [open, setOpen] = useState<string>("");

  function toggle(uuid: string) {
    setOpen((current) => (current === uuid ? "" : uuid));
  }

  let rank = 0;
  return (
    <Background title="All Time" sub="Every season on record">
      <div className="hp-page">
        {players.length > 0 && (
          <div className="hp-list">
            <div className="hp-list-head">
              <span>All Time</span>
              <span>{`${players.length} players`}</span>
            </div>
            {players.map((player) => {
              rank++;
              let expanded = open === player.user.uuid;
              let rankClass = "hp-row-rank";
              if (rank <= 3) rankClass += ` is-${rank}`;
              return (
                <div className="career-block" key={player.user.uuid}>
                  <button
                    className={`hp-row career-row${expanded ? " is-open" : ""}`}
                    aria-expanded={expanded}
                    onClick={() => toggle(player.user.uuid)}
                  >
                    <div className={rankClass}>{rank}</div>
                    <div className="hp-row-avatar">
                      <Propic
                        src={player.user.propic}
                        alt={`${player.user.first_name} ${player.user.last_name}`}
                        size={56}
                      />
                    </div>
                    <div className="hp-row-main">
                      <div className="hp-row-name">
                        {`${player.user.first_name} ${player.user.last_name}`}
                        {player.titles.map((year) => (
                          <span
                            className="career-trophy"
                            key={year}
                            title={`${year} champion`}
                          >
                            🏆
                          </span>
                        ))}
                      </div>
                      <div className="hp-row-note">
                        {`${player.seasons_played} ${player.seasons_played === 1 ? "season" : "seasons"} · ${player.picks} picks`}
                      </div>
                    </div>
                    <div className="hp-row-stats">
                      <div className="hp-stat">
                        <div className="hp-stat-value">
                          {`${player.wins}-${player.loss}-${player.ties}`}
                        </div>
                        <div className="hp-stat-label">Record</div>
                      </div>
                      <div className="hp-stat">
                        <div className="hp-stat-value">{`${player.win_pct}%`}</div>
                        <div className="hp-stat-label">Win Rate</div>
                      </div>
                      <div className="hp-stat is-muted">
                        <div className="hp-stat-value">
                          {player.avg_margin > 0
                            ? `+${player.avg_margin}`
                            : player.avg_margin}
                        </div>
                        <div className="hp-stat-label">Avg Margin</div>
                      </div>
                      <span
                        className={`career-caret${expanded ? " is-open" : ""}`}
                      />
                    </div>
                  </button>
                  {expanded && <CareerDetail player={player} />}
                </div>
              );
            })}
          </div>
        )}
        {players.length === 0 && <div className="hp-empty">No History Yet</div>}
      </div>
    </Background>
  );
}
