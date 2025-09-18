class TextField extends React.Component{
  constructor(props){
    super()
    this.state = {...props}
  }
  handleChange(e){
    let value = e.target.value
    this.state.change(this.state.field,value)
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
class Dorms extends TextField{
  constructor(props){
    super(props)
    this.state['dorms'] = props.dorms
  }
  render(){
    let id = 0;
    return(
      <div><label className="hatetheotherside">{this.state.title}</label>
      <select id="field" name="field" className="select-field w-select" defaultValue = "" onChange = {this.handleChange.bind(this)}>
      <option value="" disabled = {true}>Select one...</option>
      {this.state.dorms.map(x => {return(
        <option value={x.abbr} key = {id++}>{x.name}</option>
      )})}
      </select>
      </div>

    )
  }
}

class Elo extends React.Component{
  constructor(){
    super()
    let csrf = document.querySelector("#jungle").querySelector("input").value
    this.state = {fname:"",lname : "",email:"",uname:"",pword:'',team:"",cpword:"",dorm:"",csrfmiddlewaretoken:csrf,error:{active:false}}
  }
  changer(name,value){
    this.setState({[name]:value,error:{active:false}})
  }
  async submit(){
    let data = new FormData()
    let keys = Object.keys(this.state)
    for(let i = 0; i < keys.length;i++){
      if(keys[i] !=  "error"){
      data.append(keys[i],this.state[keys[i]])
    }
  }
  let bruh = await fetch("/juicywrld",{method:"post",body:data})
  let suh = await bruh.json()
  if(suh.status){
    window.location.href = "/pick"
  }
  else{
    this.setState({error:{active:true,message:suh.message}})
  }
}

  render(){
    return (
      <div className="div-block-2">
        <div className="div-block-3">
          <h1 className="heading">Sign-Up</h1>
        </div>
        <div className="form-block w-form">
          <div id="email-form" name="email-form" data-name="Email Form" className="form">
          {this.state.error.active &&
            <label  className="hatetheotherside" style = {{color:"red"}}>{this.state.error.message}</label>
          }
            <div className="div-block-4">
              <TextField field = "fname" title = "first name" change = {this.changer.bind(this)} value = {this.state.fname}/>
              <TextField field = "lname" title = "last name" change = {this.changer.bind(this)} value = {this.state.lname}/>
              <TextField field = "uname" title = "username" change = {this.changer.bind(this)} value = {this.state.uname}/>
              <TextField field = "email" title = "email" change = {this.changer.bind(this)} value = {this.state.email}/>
              <TextField field = "pword" title = "password" change = {this.changer.bind(this)} value = {this.state.pword} secure = {true}/>
              <TextField field = "cpword" title = "confirm password" change = {this.changer.bind(this)} value = {this.state.cpword} secure = {true}/>
              <Dorms field = "dorm" change = {this.changer.bind(this)} value = {this.state.dorm} dorms = {[{"name":"Heise","abbr":"HEI"},{"name":"Powless","abbr":"POW"}]} title = "division"/>
                <Dorms field = "team" title = "Favorite Team"  change = {this.changer.bind(this)} value = {this.state.team} dorms = {[{'abbr': '49ers', 'name': '49ers'}, {'abbr': 'seahawks', 'name': 'seahawks'}, {'abbr': 'rams', 'name': 'rams'}, {'abbr': 'cardinals', 'name': 'cardinals'}, {'abbr': 'packers', 'name': 'packers'}, {'abbr': 'vikings', 'name': 'vikings'}, {'abbr': 'bears', 'name': 'bears'}, {'abbr': 'lions', 'name': 'lions'}, {'abbr': 'eagles', 'name': 'eagles'}, {'abbr': 'cowboys', 'name': 'cowboys'}, {'abbr': 'giants', 'name': 'giants'}, {'abbr': 'washington', 'name': 'washington'}, {'abbr': 'saints', 'name': 'saints'}, {'abbr': 'falcons', 'name': 'falcons'}, {'abbr': 'panthers', 'name': 'panthers'}, {'abbr': 'ravens', 'name': 'ravens'}, {'abbr': 'buccaneers', 'name': 'buccaneers'}, {'abbr': 'steelers', 'name': 'steelers'}, {'abbr': 'browns', 'name': 'browns'}, {'abbr': 'bengals', 'name': 'bengals'}, {'abbr': 'chiefs', 'name': 'chiefs'}, {'abbr': 'broncos', 'name': 'broncos'}, {'abbr': 'raiders', 'name': 'raiders'}, {'abbr': 'chargers', 'name': 'chargers'}, {'abbr': 'patriots', 'name': 'patriots'}, {'abbr': 'bills', 'name': 'bills'}, {'abbr': 'jets', 'name': 'jets'}, {'abbr': 'dolphins', 'name': 'dolphins'}, {'abbr': 'texans', 'name': 'texans'}, {'abbr': 'titans', 'name': 'titans'}, {'abbr': 'colts', 'name': 'colts'}, {'abbr': 'jaguars', 'name': 'jaguars'}]} />
            </div><div onClick = {this.submit.bind(this)} className="button w-button" >Submit</div></div>
        </div><a href="/login" className="text-block-2 fle">Already Have An Account Login</a></div>
    )
  }
}
ReactDOM.render(React.createElement(Elo, null), document.getElementById('batman'));
