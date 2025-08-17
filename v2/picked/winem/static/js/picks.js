class Uzi extends React.Component{
  constructor(){
    super()
    this.state = {condense:false,students:[]}
  }
  flipBool(){
    this.setState(state => ({condense:!state.condense}))
  }
  componentDidMount(){
    this.dablues()
  }
  async dablues(){
    let ha = await fetch(`/currentweekpicks`)
    let b = await ha.json()
    this.setState({students:b.results})
  }
  render(){
    let id = 0
    console.log(this.state)
    return(
        <div className="div-block-13">
        {this.state.condense?
          <div className="div-block-35">
            <div className="div-block-21">
              <h1 className="heading-3">Picks</h1><div onClick = {this.flipBool.bind(this)} className="button w-button">unCondense List</div></div>
            <div className="div-block-32">
              <div className="div-block-29">
                <div className="div-block-31">Name</div>
                <div className="div-block-31 d">Team</div>
                <div className="div-block-31">W-L-T</div>
              </div>
              {this.state.students.map(x => {
                return(
                <div className="div-block-29" key = {id++}>
                  <div className="div-block-31 reg"><a style = {{color:"white"}} href = {`/userpicks/${x.uuid}`}>{x.name}</a></div>
                  <div className="div-block-31 reg">{x.team}</div>
                  <div className="div-block-31 reg">{x.wins}</div>
                </div>
              )
              })}

            </div>
          </div>
          :
          <div className="div-block-35">
            <div className="div-block-21">
              <h1 className="heading-3">Picks</h1><div onClick = {this.flipBool.bind(this)} className="button w-button">Condense List</div></div>

            {this.state.students.map(x => {
              return (
                <div className="div-block-15" key = {id++}>
              <div className="div-block-20 hand" >
                <div className="div-block-16" style ={{backgroundImage:`url(${x.image})`}}></div>
                <div className="div-block-18">
                  <div className="div-block-19">
                    <div>
                      <h1 className="heading-2 place heading-4" style = {{color:"white"}}><a  style = {{color:"white"}} href = {`/userpicks/${x.uuid}`}>{x.name}</a></h1>
                    </div>
                    <div className="div-block-26">
                      <div className="text-block-2">{x.team}</div>
                    </div>
                    <div className="div-block-26">
                      <div className="text-block-2">W-L-T:{x.wins}</div>
                    </div>
                  </div>
                </div>
              </div>
                </div>
            )})}

          </div>
      }
      </div>

    )
  }
}
ReactDOM.render(React.createElement(Uzi, null), document.getElementById('vibe'));
