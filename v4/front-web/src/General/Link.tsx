import "./link.css"
interface Props {
    route:string,
    title:string
}


export default function Link(props:Props) {
    return (
        <a href = {props.route} className = "link" >{props.title}</a>
    )
}