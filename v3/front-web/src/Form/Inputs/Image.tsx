import Input from "./Input"
import DefaultImage from "../../images/upload.png"
import Propic from "../../General/Propic"

export default class Image extends Input {
    reader:FileReader;
    state:any
    constructor(props:any) {
        super(props)
        this.reader = new FileReader();
        let initialImage = DefaultImage;
        if(props.image){
            initialImage = props.image;
        }
        this.state = {...this.state, image:initialImage}
        this.reader.onload = () => {
            this.setState({image:this.reader.result})
        }
    }
    update(event:any) {
        this.reader.readAsDataURL(event.target.files[0])
        this.props.update(event.target.files[0])
    }
    shouldComponentUpdate(prevProps:any, prevState:any) {
        return this.props.value != prevProps.value || this.state.image != prevState.image;
    }
    render() {
        return (
            <div className = "form-input">
            <Propic image = {this.state.image} />
            <input type = "file" id = "image-input" className = "image-input"
                onChange = {this.update.bind(this)} />
            <label htmlFor = "image-input" className ="form-button">{this.props.title}</label>
            </div>
        )
    }
}