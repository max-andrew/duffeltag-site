import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grow from '@material-ui/core/Grow'
import Link from '@material-ui/core/Link'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="centerBody" style={{maxWidth: '19rem'}}>
	<Grow in={true} mountOnEnter unmountOnExit>
    	<Paper className="centerItem">
          <div className="paperContent">
            <Typography variant="h3">
              Taggonit!
            </Typography>
            <div style={{ width: '20%', backgroundColor: '#99CCFF', height: '10px', margin: '.75rem 0 1.125rem' }} />
            <Typography variant="body1">
              Something went wrong and this link didn't work. 
              {" "}
              <Link className="authBodyLinkText" href="/">
                Let's go home.
              </Link>
            </Typography>
          </div>
        </Paper>
      </Grow>
    </div>
  </Layout>
)

export default NotFoundPage
