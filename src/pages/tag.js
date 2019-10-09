import React from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import BlankTag from "../components/blank_tag"
import { isLoggedIn, loginAnonymous, logOutAnon } from "../services/auth"
import { isDocWhere, getDocWhere } from "../services/mongoReadWrite"
import { OutboundLink } from 'gatsby-plugin-google-analytics'
import SEO from "../components/seo"

class Tag extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		// get tag from url
		const urlArray = window.location.href.split("/")
		var pageTag = urlArray[urlArray.indexOf("tag")+1]

		this.loadValuesToState(pageTag)
	}

	// if tag does not exist display error

	/* HELPER FUNCTIONS */
	async loadValuesToState(tag) {
		// convert tag to lowercase
		// tag = tag.toLowerCase()
		const loggedIn = await isLoggedIn()
		if (!loggedIn) {
			await loginAnonymous()
		}
		await this.tagExists(tag)
		getDocWhere("tag",tag)
		.then((value) => {
			Object.keys(value[0]).forEach(key => {
				this.setState({ [key]: value[0][key] })
			})
			this.setState({pageTag: tag})
		})
		.then(logOutAnon())
	}

	async tagExists(tag) {
		const isDoc = await isDocWhere("tag",tag)
		if (!isDoc) 
			navigate('/')
	}

  render() {
  	return (
	<Layout>
		<SEO title="Tag" />
		<div className="publicDuffeltag" style={{position:'relative', margin: '0 auto', width:'19rem'}}>
			<div className="tagText userFirstLastName">
				<p>{this.state.fname}{" "}{this.state.lname}</p>
			</div>
			<div className="tagText topTagRow">
				<p className="smallCaps platformName">{this.state.platform0}</p>
			</div>
			<div className="tagText topUserHandleRow">
				<p className="userHandle">{this.state.handle0}</p>
			</div>
			<div className="tagText topTagRow rightColumn">
				<p className="smallCaps platformName">{this.state.platform1}</p>
			</div>
			<div className="tagText topUserHandleRow rightColumn">
				<p className="userHandle">{this.state.handle1}</p>
			</div>
			<div className="tagText secondTagRow">
				<p className="smallCaps platformName">{this.state.platform2}</p>
			</div>
			<div className="tagText secondUserHandleRow">
				<p className="userHandle">{this.state.handle2}</p>
			</div>
			<div className="tagText secondTagRow rightColumn">
				<p className="smallCaps platformName">{this.state.platform3}</p>
			</div>
			<div className="tagText secondUserHandleRow rightColumn">
				<p className="userHandle">{this.state.handle3}</p>
			</div>
			<div className="tagText userDuffeltag">
				<p>{this.state.pageTag}</p>
			</div>

			<BlankTag />

			<br />
			<div style={{marginTop: '.5em'}} />
			<div style={{width: '100%', textAlign: 'center'}}>
		      <OutboundLink style={{ color: 'black', textDecoration: 'underline' }} href="/me">
		        Get your tag
		      </OutboundLink>
			</div>
		</div>
	</Layout>
    )
  }
}

export default Tag