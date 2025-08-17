

interface Props {
    image:string,
    style?:any,
    width?:string,
    height?:string,
}

export default function Propic(props:Props) {
    let style = {height:props.height, width:props.width}
    return (
        <div className = "image-input-border" style = {{...props.style, ...style}}>
                <img style = {style} src = {props.image} className = "input-image"/>
        </div>
    )
}