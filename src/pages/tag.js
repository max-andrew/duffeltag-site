import React from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import { isLoggedIn, loginAnonymous, logOutAnon } from "../services/auth"
import { isDocWhere, getDocWhere } from "../services/mongoReadWrite"
import SEO from "../components/seo"
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grow from '@material-ui/core/Grow'
import Slide from '@material-ui/core/Slide'
import Link from '@material-ui/core/Link'

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
		<div className="centerBody">
		<Grow in={true} mountOnEnter unmountOnExit>
			<Card className="centerItem authCard">
				<CardContent className="tagCardContent">
					<Typography className="tagFullName" variant="h3">
						{this.state.fname}{" "}{this.state.lname}
					</Typography>
					<br />
					<Typography className="smallCaps" variant="body2">
						{this.state.platform0}
					</Typography>
					<Typography className="platformTag" variant="h5">
						{this.state.handle0}
					</Typography>
					<br />
					<Typography className="smallCaps" variant="body2">
						{this.state.platform1}
					</Typography>
					<Typography className="platformTag" variant="h5">
						{this.state.handle1}
					</Typography>
					<br />
					<Typography className="smallCaps" variant="body2">
						{this.state.platform2}
					</Typography>
					<Typography className="platformTag" variant="h5">
						{this.state.handle2}
					</Typography>
					<br />
					<Typography className="smallCaps" variant="body2">
						{this.state.platform3}
					</Typography>
					<Typography className="platformTag" variant="h5">
						{this.state.handle3}
					</Typography>
					<br />
					<Typography className="platformTag userDuffeltag" variant="h5">
						{this.state.pageTag}
					</Typography>
				</CardContent>
			</Card>
		</Grow>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
			<Typography className="authBodyLink">
				<Link
					component="button"
					variant="body2"
					className="authBodyLinkText"
					href="/me"
				>
					Get your tag
				</Link>
			</Typography>
        </Slide>
        </div>
	</Layout>
    )
  }
}

export default Tag