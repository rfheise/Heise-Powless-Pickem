import {Hof} from "./Route"
import UserBox from "../General/UserBox"
import Text from "../General/Text"

export default function HofBox(props:Hof) {
    return (
        <UserBox user = {props.user}>
            <Text size = "1.5rem">
                {props.record}
            </Text>
            <Text size = "2rem">
                {props.year}
            </Text>
            
        </UserBox>
    )
}