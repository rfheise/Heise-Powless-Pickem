import Input from './Input'


export default class Text extends Input {
    render() {
        return (
            <div className = "form-input">
                <div className = "input-title">
                    {this.props.title}
                </div>
                <input type = "text" className = "text-input" value = {this.props.value}
                    onChange = {this.update.bind(this)} 
                    placeholder = {this.props.placeholder}/>
            </div>
        )
    }
}