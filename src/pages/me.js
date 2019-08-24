import React from "react"
import { navigate } from "gatsby"
import { isBrowser, isLoggedIn, handleLogout, logOutAnon } from "../services/auth"
import { updateValue, getValue, getUserObject, isDocWhere } from "../services/mongoReadWrite"
import restrictedTags from "../components/restricted.json"
import Layout from "../components/layout"
import SEO from "../components/seo"

class Me extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputNamesToBeUpdated: [],
      supported_platforms: ["Instagram","Snapchat","Phone","Venmo","VSCO","WhatsApp","Twitter","Facebook","TikTok","Spotify"],
    }
  }

  componentDidMount() {
    // preload all available inputs
    this.loadValuesToState()
    .then(this.setState({ saved_tag: this.state.tag }))

    this.loadCurrentSavedTag()
  }
  
  /* HELPER FUNCTIONS */
  async loadValuesToState() {
    logOutAnon()
    const loggedIn = await isLoggedIn()
    if (!loggedIn) 
      navigate(`/login`)
    const allInputs = ["tag","fname","lname","handle0","platform0","handle1","platform1","handle2","platform2","handle3","platform3"]
    allInputs.forEach(item => {
      console.log(item)
      getValue(item)
      .then(value => {
        if (!!value)
          this.setState({ [item]: value })
      })
    })
  }

  // save the current backend tag for user
  loadCurrentSavedTag() {
    getValue("tag")
    .then(value => {
      if (!!value)
        this.setState({ saved_tag: value })
    })
  }

  addUniqueItemToList(item, list) {
    if(list.indexOf(item) === -1)
      list.push(item)

    return list
  }

  // for all values edited by user, update to db
  async updateUser() {
    // get all input names upsert the value of each to the database
    var updateList = this.state.inputNamesToBeUpdated
    // get tag input
    var tag = this.state.tag.toLowerCase()
    // was tag changed
    var tagChanged = (this.state.tag !== this.state.saved_tag)

    // check if tag was changed
    if (updateList.includes("tag")) {
      // confirm tag is available, otherwise use saved tag
      const available = await this.tagIsAvailable()
      if (!available) {
        // remove from update list
        updateList.splice(updateList.indexOf("tag"), 1);
        if (tagChanged)
          // show unavailable message
          this.setState({showStillAvailableMessage: true})
      }
      else {
        this.setState({saved_tag:tag})
      }
    }
    for (const inputName of updateList) {
      console.log("Updating " + inputName + " to " + this.state[inputName])
      await updateValue(inputName, this.state[inputName])
    }
    // reset list of input names to be updated
    this.setState({
      inputNamesToBeUpdated: [],
      showTagUpdatedMessage: true,
    })
  }

  // return option tags for all supported platforms as defined in state
  getHandleOptions() {
    // get string of option tags
    var options = []
    // counter for key
    var i = 0
    this.state.supported_platforms.forEach(platform => {
      options.push(<option key={i} value={platform}>{platform}</option>)
      i++
    })
    return options
  }

  // determine if tag follows rules and is not taken
  async tagIsAvailable() {
    // get tag from state
    const tag = this.state.tag.toLowerCase()

    // is tag proper length
    if (tag.length<3 || tag.length>18)
      return false

    // is tag proper format
    if (tag.match(/^[a-z0-9]+$/i) === null)
      return false

    // is tag restricted (notable, reserved, offensive...)
    var tagRestricted = false
    Object.keys(restrictedTags).map(function(element) {
      if (restrictedTags[element].includes(tag)) {
        console.log("Tag restricted.");
        tagRestricted = true
      }
    })
    if (tagRestricted)
      return false

    // is tag taken by another user
    if (await isDocWhere("tag",tag))
      return false

    return true
  }

  hasTag() {
    return (!!this.state.tag)
  }

  /* EVENT HANDLING */
  handleUpdate = event => {
    // get name of field from user input
    const inputName = event.target.getAttribute('name')
    // add name to list of names if unique
    const inputNames = this.addUniqueItemToList(inputName, this.state.inputNamesToBeUpdated)

    this.setState({
      [event.target.name]: event.target.value,
      inputNamesToBeUpdated: inputNames,
      showTagUpdatedMessage: false,
      showStillAvailableMessage: false
    })
  }

  handleAvailability = () => this.tagIsAvailable().then(item => this.setState({ showStillAvailableMessage: true, tagAvailable: item }))

  render() {
    const getShareCard = () => {
      return this.hasTag() ?  
        <div>
          <div className="card shareCard">
            <h2><span role="img" aria-label="send">✉️</span>  Share tag</h2>
            <h3 className="shareLink">dffl.me/{this.state.saved_tag}</h3>
            <p>Share this link to your Duffeltag in person, in bios, in DMs... anywhere!</p>
            <button onClick={event => { navigate('/tag/'+this.state.saved_tag) }}>SEE MY TAG</button>
          </div>
        </div>
      : <div />
    }

    const getAvailabilityMessage = () => { 
      if (this.state.showStillAvailableMessage) {
        return this.state.tagAvailable ? 
        <p style={{fontSize: '10px'}} className="smallCaps">Available</p> 
      : <p style={{fontSize: '10px'}} className="smallCaps">Sorry, unavailable</p>  
      }
      return null
    }

    const getHandleBars = () => {
      var rows = [];
      for (var i = 0; i < 4; i++) {
        const selectName = "platform"+i
        const inputName = "handle"+i
        rows.push(
        <div className="block" key={i}>
          <label>
            Handle #{i+1}
            <br />
            <div style={{marginTop: '.1em'}} />
            <select 
              name={selectName}
              onChange={this.handleUpdate}
              value={this.state[selectName]}
            >
              <option value=" ">Choose Platform</option>
              {this.getHandleOptions()}
            </select>
          </label>

            <br />
            <div style={{marginTop: '.5em'}} />

            <input 
              type="text" 
              name={inputName}
              placeholder="account handle" 
              spellcheck="false"
              autocapitalize="none"
              onChange={this.handleUpdate}
              defaultValue={this.state[inputName]} 
            />
          <br />
          <div style={{marginTop: '1em'}} />
        </div>)
      }
      return rows
    }

    return (
      <Layout>
        <SEO title="Me" />
        <h1>My Duffeltag</h1>

        {getShareCard()}

        <div className="card" style={{ maxWidth: '28em' }}>
          <h2><span role="img" aria-label="tag">🏷️</span>  Update tag</h2>
          <div style={{clear:'left'}} />
          <div className="formBody">
            <div style={{marginTop: '.5em'}} />

            <p className="smallCaps">My tag</p>
            <div style={{marginTop: '.5em'}} />

            <div className="block">
              <label>
                Duffeltag {" "}
                <br />
                <div style={{marginTop: '.1em'}} />
                <input 
                  type="text" 
                  name="tag" 
                  spellcheck="false"
                  autocapitalize="none"
                  onChange={this.handleUpdate} 
                  defaultValue={this.state.tag} 
                />
              </label>

              <br />
              {getAvailabilityMessage()}
              <div style={{marginTop: '.25em'}} />
              <button className="shortWideButton" onClick={this.handleAvailability}>CHECK AVAILABILITY</button>
              <br />
              <div style={{marginTop: '1em'}} />
            </div>

            <div style={{clear:'left'}} />
            <div style={{marginTop: '.5em'}} />

            <p className="smallCaps">My name</p>
            <div style={{marginTop: '.5em'}} />

            <div className="block">
              <label>
                First Name {" "}
                <br />
                <div style={{marginTop: '.1em'}} />
                <input 
                  type="text" 
                  name="fname"
                  spellcheck="false"
                  onChange={this.handleUpdate} 
                  defaultValue={this.state.fname} 
                />
              </label>
              <br />
              <div style={{marginTop: '1em'}} />
            </div>

            <div className="block">
              <label>
                Last Name {" "}
                <br />
                <div style={{marginTop: '.1em'}} />
                <input 
                  type="text" 
                  name="lname"
                  spellcheck="false"
                  onChange={this.handleUpdate} 
                  defaultValue={this.state.lname} 
                />
              </label>
              <br />
              <div style={{marginTop: '1em'}} />
            </div>

            <div style={{clear:'left'}} />
            <div style={{marginTop: '.5em'}} />

            <p className="smallCaps">My handles</p>
            <div style={{marginTop: '.5em'}} />

            {getHandleBars()}

            <div style={{clear:'left'}} />
            <div style={{marginTop: '1.5em'}} />

            <button onClick={event => {this.updateUser()}}>UPDATE</button>
            <br />
            { this.state.showTagUpdatedMessage ? 
              <p style={{fontSize: '10px'}} className="smallCaps">
                Tag updated
              </p> 
              : null }
          </div>
        </div>
        <br />
        <div style={{marginTop: '2em'}} />
        <div style={{width: '100%', textAlign: 'center'}}>
          <a 
            style={{color: 'white'}} 
            href="#" 
            onClick={event => {handleLogout()}}
          >
            Log Out
          </a>
        </div>
      </Layout>
    )
  }
}

export default Me