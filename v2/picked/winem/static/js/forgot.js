//generates page based upon one of three possible values passed in
//Forgot Password
//Forgot Username
//Forgot
class Input extends React.Component{
  constructor(props){
    super(props)
    this.state = {...props}
  }
  changeMe(e){
    let bruh = e.target.value
    this.state.change(bruh,this.state.id)
  }
  componentDidUpdate(op){
    if(op.value != this.props.value){
      this.setState({value:this.props.value})
    }
  }
  render(){
    return(
      <div className="div-block-52">
      <label className="field-label">{this.state.title}</label>
      <input type={this.state.secure? "password":"text"} onChange = {this.changeMe.bind(this)} className="w-input"  value = {this.state.value} placeholder ={`Enter ${this.state.title} here`}/>
      </div>
    )
  }
}

class Jif extends React.Component{
  constructor(props){
    super(props)
    let list = []
    let title = ""
    switch(props.type){
      case "Forgot Password":
        list = [{secure:false,title:"username",type:"uname"},{secure:false,title:"email",type:"email"}]
        title = "Forgot Password"
        break
      case "Reset Password":
        list = [{secure:true,title:"new password",type:"npword"},{secure:true,title:"confirm password",type:"cpword"}]
        title = "Reset Password"
        break
      //forgot username
      default:
        list = [{secure:false,title:"email",type:"email"}]
        title = "Forgot Username"
        break
    }
    for(let i = 0; i < list.length; i++){
      list[i].id = i;
      list[i].value = ""
    }
    this.state = {list:list,title:title,error:"",success:false,csrf:props.csrf}
  }
  change(value,id){
    //takes in previous state and updates the new value of the specific type
    let list = [...this.state.list]
    list[id].value = value
    this.setState({list:list,message:""})
  }
  async submit(){
    let url = "/"
    switch(this.state.title){
      case "Forgot Password":
        url += "forgot_password"
        break
      case "Reset Password":
        url += "reset_password"
        if(this.state.list[0].value != this.state.list[0].value){
          this.setState({error:"Passwords do not match"})
        }
        break
      default:
        url += "forgot_username"
        break
    }
    let data = new FormData()
    for(let i =0; i < this.state.list.length;i++){
      let obj = this.state.list[i]
      data.append(obj.type,obj.value)
    }
    data.append("csrfmiddlewaretoken",this.state.csrf)
    let me = await fetch(url,{method:"post",body:data})
    let bruh = await me.json()
    if(bruh.status){
      this.setState({success:true,message:bruh.message})
    }
    else{
      this.setState({message:bruh.message})
    }
  }
  render(){
    return(
      <div className="div-block-48">
        <div className="div-block-49">
          <div className="div-block-50">
            <div className="text-block-5">{this.state.title}</div>
          </div>
          <div className="div-block-51">
            <div className="form-block-3 w-form">
            {this.state.success ?
              <div id="email-form" name="email-form" data-name="Email Form" className="form-2">
              {this.state.message &&
                <label className="field-label" style = {{color:"white",fontSize:"20px"}}>{this.state.message}</label>
              }
              </div>
            :
              <div id="email-form" name="email-form" data-name="Email Form" className="form-2">
              {this.state.message &&
                <label className="field-label" style = {{color:"red"}}>{this.state.message}</label>
              }
                <div className="div-block-52">
                {this.state.list.map(x => {
                  return(
                    <Input {...x} change = {this.change.bind(this)} key = {x.id}/>
                  )
                })}
                </div>
                  <div type="submit" onClick = {this.submit.bind(this)} className="submit-button w-button" >Submit</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
