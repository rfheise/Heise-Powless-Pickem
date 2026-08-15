import UserBox from "../General/UserBox";
import Stat from "../General/Stat";
import { place } from "@/lib/format";
import { User } from "@/lib/interfaces";
import Background from "../Background/Background";
import back from "@/images/backgrounds/clarg.jpg";
import { current_year } from "@/lib/config";
import UpdateStandingsButton from "./UpdateStandingsButton";

interface Props {
  standings: User[];
  shame?: boolean;
}

function getGameStr(user: User) {
  return `${user.win}_${user.loss}_${user.tie}`;
}

//standings page. The table is rendered on the server - there is nothing on
//it to interact with except the update button, which is the only piece that
//ships as client javascript.
export default function Standings(props: Props) {
  const standings = props.standings;
  //determines if two users have the same standing
  //returns true if they do otherwise false
  function sameStanding(user1: User, user2: User) {
    return (
      user1.win == user2.win &&
      user1.tie == user2.tie &&
      user1.loss == user2.loss &&
      user1.avg_margin == user2.avg_margin
    );
  }
  let id = 1;
  let lastId = id;
  let standings_var = [...standings];
  if (props.shame) {
    //remove first entry from list
    if (standings_var.length > 0) {
      standings_var.shift();
    }
    //reverse list
    for (let i = 0; i < Math.floor(standings_var.length / 2); i++) {
      let tmp = standings_var[standings_var.length - i - 1];
      standings_var[standings_var.length - i - 1] = standings_var[i];
      standings_var[i] = tmp;
    }
  }

  //compute margin gap behind largest margin
  let max_margin: any = {};
  for (let i = 0; i < standings_var.length; i++) {
    let user = standings_var[i];
    user.margin_gap = Math.round(
      (user.win + user.loss + user.tie) * user.avg_margin,
    );
    let game_str = getGameStr(user);
    if (
      max_margin[game_str] == undefined ||
      user.margin_gap > max_margin[game_str]
    ) {
      max_margin[game_str] = user.margin_gap;
    }
  }
  for (let i = 0; i < standings_var.length; i++) {
    let user = standings_var[i];
    let game_str = getGameStr(user);
    if (user.margin_gap !== null) {
      user.margin_gap = max_margin[game_str] - user.margin_gap;
    }
  }

  return (
    <Background
      image={back}
      title={props.shame ? "Hall of Shame" : "Standings"}
      sub={`${current_year} Season`}
    >
      <div className="hp-page">
        {standings_var.length > 0 && (
          <div className="hp-list">
            <div className="hp-list-head">
              <span>{props.shame ? "Bringing up the rear" : "The Table"}</span>
              <span>{`${standings_var.length} ${standings_var.length === 1 ? "player" : "players"}`}</span>
            </div>
            {standings_var.map((user) => {
              let placement = id;
              //calculate place
              //if not first user and users have same standing
              //give them the same place
              if (id > 1 && sameStanding(standings[lastId - 1], user)) {
                placement = lastId;
              } else {
                //update lastId to be new id
                lastId = id;
              }
              //increment count
              id++;
              //medal styling for the top three
              let rankStyle =
                !props.shame && placement <= 3 ? `${placement}` : undefined;
              return (
                <UserBox
                  key={id}
                  user={user}
                  rank={props.shame ? undefined : place(placement)}
                  rankStyle={rankStyle}
                >
                  <Stat
                    label="Record"
                    value={`${user.win}-${user.loss}-${user.tie}`}
                  />
                  <Stat
                    label="Avg Margin"
                    tone="muted"
                    value={user.avg_margin}
                  />
                  <Stat
                    label="Margin Tie Diff"
                    tone={user.margin_gap == 0 ? "lead" : "muted"}
                    value={user.margin_gap == 0 ? "Tie Leader" : user.margin_gap}
                  />
                </UserBox>
              );
            })}
          </div>
        )}
        {standings_var.length === 0 && (
          <div className="hp-empty">No Standings Yet</div>
        )}
        {!props.shame && <UpdateStandingsButton />}
      </div>
    </Background>
  );
}
