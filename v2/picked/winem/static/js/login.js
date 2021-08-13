class TextField extends React.Component{
  constructor(props){
    super()
    this.state = {...props}
  }
  handleChange(e){
    let value = e.target.value
    this.state.change(this.state.title,value)
  }
  componentDidUpdate(op){
    if(this.props.value != op.value){
      this.setState({value:this.props.value})
    }
  }
  render(){
    return (
      <div>
      <label className="hatetheotherside">{this.state.title}</label>
      <input onChange = {this.handleChange.bind(this)} type={this.state.secure?"password":"text"} className="text-field-2 w-input" value = {this.state.value} placeholder = {`Enter ${this.state.title} here`} />
      </div>
    )
  }
}

class BennieAndJets extends React.Component{
  constructor(){
  super()
  let csrf = document.querySelector("#csrf").querySelector("input").value
  this.state = {username:"",password:"",csrf:csrf,error:{active:false}}
  }
  handleChange(name,value){
    this.setState({[name]:value,error:{active:false}})
  }
  async submit(){
    let data = new FormData()
    data.append('username',this.state.username)
    data.append('password',this.state.password)
    data.append('csrfmiddlewaretoken',this.state.csrf)
    let me = await fetch("/hatetheotherside",{method:'post',body:data})
    let bruh = await me.json()
    if(bruh.status){
      window.location.href = "/pick"
    }
    else{
      this.setState({error:{active:true,message:bruh.message}})
    }
  }
  render(){
    return(
          <div className="div-block-2">
            <div className="div-block-3">
              <h1 className="heading">Login</h1>
            </div>
            <div className="form-block w-form">
              <div id="email-form" name="email-form" data-name="Email Form" className="form">
              {this.state.error.active &&
                  <div style = {{color:"red"}} >{this.state.error.message}</div>
              }
                <div className="div-block-4">
                <TextField title = "username" value = {this.state.username} change = {this.handleChange.bind(this)} />
                <TextField title = "password" value = {this.state.password} change = {this.handleChange.bind(this)} secure = {true} />
              </div>
                <div  className="button w-button" onClick = {this.submit.bind(this)}>Submit</div>
              </div>
            </div><a href="/signup" className="link">Don&#x27;t Have An Account, Sign Up</a>
            <div className="div-block-40"><a href="/forgot_username" className="link">Forgot Username </a><a href="/forgot_password" className="link">Forgot Password</a></div>
          </div>

    )
  }
}
ReactDOM.render(React.createElement(BennieAndJets, null), document.getElementById('batman'));
