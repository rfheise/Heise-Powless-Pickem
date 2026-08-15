import { Team, User, Week } from "./interfaces";

//--- recap -----------------------------------------------------------------

//one pick that won an award
export interface AwardPick {
  user: User;
  team: Team;
  margin: number;
  result: string;
  score: string;
}

export interface Herd {
  team: Team;
  count: number;
  wins: number;
  loss: number;
  ties: number;
}

export interface Movement {
  user: User;
  rank_before: number | null;
  rank_after: number | null;
  delta: number;
  record: string;
}

export interface RecapData {
  week: Week;
  scoreboard: {
    picks: number;
    players: number;
    wins: number;
    loss: number;
    ties: number;
    pending: number;
  };
  awards: {
    blowout: AwardPick | null;
    squeaker: AwardPick | null;
    worst_beat: AwardPick | null;
    lone_wolf: AwardPick | null;
    herd: Herd | null;
  };
  movement: Movement[];
}

//--- picks -----------------------------------------------------------------

export interface PickInterface {
  picker: User;
  team: Team;
  week: Week;
  result: string;
  game: any;
}

//--- hall of fame ----------------------------------------------------------

export interface Hof {
  user: User;
  record: string;
  year: number;
}

//--- announcements ---------------------------------------------------------

export interface AnnouncementInterface {
  user: User;
  announcement: string;
  timestamp: string;
}

//--- voting ----------------------------------------------------------------

export interface Vote {
  user: User;
  votes: string;
}

//--- career ----------------------------------------------------------------

export interface Season {
  year: number;
  wins: number;
  loss: number;
  ties: number;
  avg_margin: number;
  win_pct: number;
  finish: number | null;
  champion: boolean;
}

export interface TeamStat {
  team: Team;
  count: number;
  wins: number;
  loss: number;
  ties: number;
}

export interface Player {
  user: User;
  wins: number;
  loss: number;
  ties: number;
  win_pct: number;
  avg_margin: number;
  picks: number;
  seasons_played: number;
  titles: number[];
  seasons: Season[];
  teams: { most: TeamStat[]; unluckiest: TeamStat | null; never: Team[] };
  extremes: {
    best: Season | null;
    worst: Season | null;
    streak: { length: number; start: string | null; end: string | null };
  };
}

//--- burn chart ------------------------------------------------------------

export interface TeamRow {
  team: Team;
  //"available" | "burned" | "banned"
  state: string;
  week: number | null;
  result: string | null;
}

export interface BurnData {
  year: number;
  current_season: boolean;
  counts: { available: number; burned: number; banned: number };
  teams: TeamRow[];
}
