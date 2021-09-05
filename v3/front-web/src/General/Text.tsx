import "./user.css"

interface Props {
    style?:any,
    color?:string,
    size?:string,
    children:any,
}

//wrapper for div
//used for quick displaing formatted text
export default function Text(props:Props) {
    let style = {...props.style}
    //set color if it exists if not use default
    style.color = (props.color ? props.color: "#707070")
    //set size if it exists if not use default
    style.fontSize = (props.size ? props.size: "1.7rem")
    return (
        <div className = "user-text" style = {style}>
            {props.children}
        </div>
    )
}