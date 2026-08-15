

interface Props {
    image:string,
    style?:any,
    width?:string,
    height?:string,
    className?:string,
    alt?:string,
}

export default function Propic(props:Props) {
    let style = {height:props.height, width:props.width}
    return (
        <div className = {`image-input-border${props.className ? ` ${props.className}` : ""}`}
            style = {{...props.style, ...style}}>
                <img style = {style} src = {props.image} alt = {props.alt ? props.alt : ""}
                    className = "input-image"/>
        </div>
    )
}
