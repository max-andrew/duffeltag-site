import React from "react"
import { navigate } from "gatsby"
import { isLoggedIn, handleLogout, logOutAnon } from "../services/auth"
import { updateValue, getValue, isDocWhere } from "../services/mongoReadWrite"
import restrictedTags from "../components/restricted.json"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grow from '@material-ui/core/Grow'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Link from '@material-ui/core/Link'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

var QRCode = require('qrcode.react')

class Me extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputNamesToBeUpdated: [],
      supported_platforms: ["Instagram","Snapchat","Phone","Venmo","VSCO","WhatsApp",
      						"Twitch","Slack","Discord","Twitter","Facebook","LinkedIn",
      						"TikTok","Spotify"],
    }
  }

  UNSAFE_componentWillMount() {
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
    const allInputs = ["tag","fname","lname","handle0","platform0","handle1",
    					"platform1","handle2","platform2","handle3","platform3"]
    allInputs.forEach(item => {
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

  getUserFirstName() {
    return this.state.fname
  }

  // for all values edited by user, update to db
  async updateUser() {
    // get all input names upsert the value of each to the database
    var updateList = this.state.inputNamesToBeUpdated
    // get tag input
    var tag = this.state.tag
    // make lowercase and add to state
    await this.setState({tag: tag.toLowerCase()})
    // was tag changed
    var tagChanged = (this.state.tag !== this.state.saved_tag)

    // check if tag was changed
    if (updateList.includes("tag")) {
      // confirm tag is available, otherwise use saved tag
      const available = await this.tagIsAvailable()
      if (!available) {
        // remove from update list
        updateList.splice(updateList.indexOf("tag"), 1)
        if (tagChanged)
          // show unavailable message
          this.setState({tagError: true, tagHelpText: "Unavailable"})
      }
      else {
        this.setState({tagError: false, tagHelpText: "", showTagUpdatedMessage: true, saved_tag: tag})
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
      options.push(<MenuItem key={i} value={platform}>{platform}</MenuItem>)
      i++
    })
    return options
  }

  // determine if tag follows rules and is not taken
  async tagIsAvailable() {
    // get tag from state
    let tag = await this.state.tag
    tag = tag.toLowerCase()

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
        tagRestricted = true
      }
      return true
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

	handleSelectChange = name => event => {
		this.setState({
			[name]: event.target.value,
		})
	}

	handleAvailability = () => 
		this.tagIsAvailable()
		.then(item => this.setState({ tagError: !item, tagHelpText: !item ? "Unavailable" : "Available" }))

  render() {
    const getHandleBars = () => {
    	var rows = []
    	for (var i = 0; i < 4; i++) {
        	const selectName = "platform"+i
			const inputName = "handle"+i
			rows.push(
				<div key={i}>
				<div className="block">
					<InputLabel shrink htmlFor={selectName}>
					Platform
					</InputLabel>
					<Select
						name={selectName}
						value={this.state[selectName] || ''}
						onChange={this.handleSelectChange}
						inputProps={{
							name: selectName,
							id: selectName,
						}}
						>
						{this.getHandleOptions()}
					</Select>
					<br />
					<TextField
						label={"Handle"}
						type="text"
						name={inputName}
						value={this.state[inputName] || ''}
						onChange={this.handleUpdate}
						margin="normal"
						/>
				</div>
				<br />
			</div>
		)
      }
      return rows
    }

    const getShareCardTitle = () => {
	  	return !!this.state.tag ?
	  		<Typography variant="h4">
				<span role="img" aria-label="welcome">✉️</span>
				{" "} Share tag
			</Typography>
			: <Typography variant="h4">
				<span role="img" aria-label="welcome">👋</span>
				{" "} Welcome to Duffeltag!
			</Typography>
  	}

  	const getShareCardBodyText = () => { 
		return !!this.state.tag ? 
			<div>
				<Typography variant="h6">duffeltag.me/{this.state.saved_tag}</Typography>
				<Typography variant="body2">
					Text this link, DM it, or share it in your bios, stories... anywhere!
				</Typography>
				<br />
				<QRCode size={133} value={"duffeltag.com/tag/"+this.state.saved_tag} />
				<Typography variant="body2">
					Have your friend scan this code with their Camera app
				</Typography>
				<br />
				<Button onClick={event => { navigate('/tag/'+this.state.saved_tag) }}>
					SEE MY TAG
				</Button>
			</div>
			: <Typography variant="body1">
				Build your Duffeltag below to get started!
			</Typography>
	}

    return (
        <Layout>
          <SEO title="Me" />
          <div className="centerBody">
			<Grow in={true} style={{ maxWidth: "28em"}} mountOnEnter unmountOnExit>
				<Paper className="shareCard">
					<div className="paperContent">
						{getShareCardTitle()}
						<br />
						{getShareCardBodyText()}
					</div>
				</Paper>
			</Grow>

			<br />

			<Grow in={true} style={{ maxWidth: "28em"}} mountOnEnter unmountOnExit>
				<Paper className="updateTagPaper">
					<div className="paperContent">
						<Typography variant="h4">
							<span role="img" aria-label="welcome">🏷️</span>
							{" "} Update tag
						</Typography>
						<br />
						<TextField
							label="Duffeltag"
							type="text"
							name="tag"
							value={this.state.tag || ''}
							onChange={this.handleUpdate}
							error={this.state.tagError}
							margin="normal"
							helperText={this.state.tagHelpText}
							/>
						<Typography className="authBodyLink">
							<Link
								component="button"
								variant="body2"
								className="authBodyLinkText"
								onClick={() => {this.handleAvailability()}}
								>
								Check availability
							</Link>
						</Typography>

						<br />
						<TextField
							label="First Name"
							type="text"
							name="fname"
							value={this.state.fname || ''}
							onChange={this.handleUpdate}
							error={this.state.fnameError}
							margin="normal"
							helperText={this.state.fnameHelpText}
							/>

						<TextField
							label="Last Name"
							type="text"
							name="lname"
							value={this.state.lname || ''}
							onChange={this.handleUpdate}
							error={this.state.lnameError}
							margin="normal"
							helperText={this.state.lnameHelpText}
							/>

						<br />
						{getHandleBars()}

						<br />
						<br />
						<Button onClick={event => {this.updateUser()}} size="medium">Update</Button>
						<Snackbar
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							open={this.state.showTagUpdatedMessage}
							autoHideDuration={3000}
							onClose={() => {this.setState({showTagUpdatedMessage: false})}}
							ContentProps={{
								'aria-describedby': 'message-id',
							}}
							message={<span id="message-id">Tag updated</span>}
							action={[
								<IconButton
									key="close"
									aria-label="close"
									color="inherit"
									onClick={() => {this.setState({showTagUpdatedMessage: false})}}
									>
									<CloseIcon />
								</IconButton>,
							]}
						/>
					</div>
				</Paper>
			</Grow>

            <br />

			<div style={{marginTop: '2em'}} />
				<div style={{width: '100%', textAlign: 'center'}}>
					<Button 
					size="small" 
					style={{fontFamily: "Apercu-Bold"}} 
					onClick={event => {handleLogout()}}
					>
						Log Out
					</Button>
				</div>
			</div>
		</Layout>
    )
  }
}

export default Me