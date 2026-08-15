import Link from "next/link";
import { AwardPick, Herd } from "@/lib/types";
import { Logo, Propic } from "../General/Avatar";

interface Props {
  icon: string;
  title: string;
  //an award won by a single pick
  pick?: AwardPick | null;
  //the herd award, which is about a team rather than a person
  herd?: Herd | null;
  note?: string;
}

function signed(margin: number) {
  return margin > 0 ? `+${margin}` : `${margin}`;
}

export default function AwardCard(props: Props) {
  //nothing to celebrate this week
  if (!props.pick && !props.herd) {
    return (
      <div className="award is-empty">
        <div className="award-head">
          <span className="award-icon">{props.icon}</span>
          <span className="award-title">{props.title}</span>
        </div>
        <div className="award-none">Nobody this week</div>
      </div>
    );
  }

  if (props.herd) {
    let h = props.herd;
    return (
      <div className="award">
        <div className="award-head">
          <span className="award-icon">{props.icon}</span>
          <span className="award-title">{props.title}</span>
        </div>
        <div className="award-body">
          <div className="award-avatar is-logo">
            <Logo src={h.team.logo} alt={h.team.name} size={48} />
          </div>
          <div className="award-detail">
            <div className="award-name">{h.team.name}</div>
            <div className="award-sub">{`${h.count} picked them`}</div>
          </div>
          <div className="award-margin hp-num">
            {`${h.wins}-${h.loss}${h.ties > 0 ? `-${h.ties}` : ""}`}
          </div>
        </div>
      </div>
    );
  }

  let p = props.pick as AwardPick;
  return (
    <Link className="award" href={`/picks/${p.user.uuid}`}>
      <div className="award-head">
        <span className="award-icon">{props.icon}</span>
        <span className="award-title">{props.title}</span>
      </div>
      <div className="award-body">
        <div className="award-avatar">
          <Propic
            src={p.user.propic}
            alt={`${p.user.first_name} ${p.user.last_name}`}
            size={48}
          />
        </div>
        <div className="award-detail">
          <div className="award-name">
            {`${p.user.first_name} ${p.user.last_name}`}
          </div>
          <div className="award-sub">{p.team.name}</div>
        </div>
        <div
          className={`award-margin hp-num ${p.margin >= 0 ? "is-win" : "is-loss"}`}
        >
          {signed(p.margin)}
        </div>
      </div>
      <div className="award-foot">{props.note ? props.note : p.score}</div>
    </Link>
  );
}
