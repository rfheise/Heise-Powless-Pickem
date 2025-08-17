
interface Props {
    title:string,
    onClick():void
}

//nav button
export default function NavButton(props:Props) {
    return (
        <div className = "button" onClick = {props.onClick}>
            {props.title}
        </div>
    )
}