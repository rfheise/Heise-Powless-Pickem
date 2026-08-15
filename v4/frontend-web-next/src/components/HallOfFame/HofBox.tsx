import { Hof } from "@/lib/types";
import UserBox from "../General/UserBox";
import Stat from "../General/Stat";

export default function HofBox(props: Hof) {
  return (
    <UserBox user={props.user} rank="🏆" rankStyle="1" note="Champion">
      <Stat label="Record" value={props.record} />
      <Stat label="Season" value={props.year} />
    </UserBox>
  );
}
