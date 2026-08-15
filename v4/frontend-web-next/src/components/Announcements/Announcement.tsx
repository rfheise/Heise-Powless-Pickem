import { AnnouncementInterface } from "@/lib/types";
import { Propic } from "../General/Avatar";

export default function Announcement(props: AnnouncementInterface) {
  return (
    <article className="announcement">
      <div className="announcement-header">
        <div className="announcement-avatar">
          <Propic
            src={props.user.propic}
            alt={`${props.user.first_name} ${props.user.last_name}`}
            size={52}
          />
        </div>
        <div className="announcement-name">
          <div className="announcement-author">
            {`${props.user.first_name} ${props.user.last_name}`}
          </div>
          <div className="announcement-time">{props.timestamp}</div>
        </div>
      </div>
      <div className="announcement-text">{props.announcement}</div>
    </article>
  );
}
