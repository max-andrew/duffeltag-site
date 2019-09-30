import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import DanTag from "../components/dan_tag"
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Slide from '@material-ui/core/Slide'

export default function IndexPage() {
  return (
    <Layout>
      <SEO title="Home" />
      <div className="homeContainer" style={{margin: '0 auto'}}>

        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <div className="splashPaper">
            <Paper>
              <div className="paperContent">
                <Typography variant="h3">
                  Handle your handles.
                </Typography>
                <div style={{ width: '20%', backgroundColor: '#99CCFF', height: '10px', margin: '.75rem 0 1.125rem' }} />
                <Typography variant="body1">
                  Meeting someone new? Don’t give them 10 handles. 
                  Give them your Duffeltag. They can access all your 
                  profiles with just one username. That’s handy.
                </Typography>
              </div>
            </Paper>
          </div>
        </Slide>

        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <div className="splashTag">
            <DanTag />
          </div>
        </Slide>

        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <div className="splashButton">
            <Button href="/login" variant="contained" className="blueButton">
              GET DUFFELTAG
            </Button>
          </div>
        </Slide>
      </div>
    </Layout>
  )
}
