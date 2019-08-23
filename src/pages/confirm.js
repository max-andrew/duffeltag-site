import React from "react"
import { navigate } from "gatsby"
import { OutboundLink } from 'gatsby-plugin-google-analytics'
import Layout from "../components/layout"
import SEO from "../components/seo"
import { confirmEmail } from "../services/auth"

class Page extends React.Component {
  componentDidMount() {
    confirmEmail()
  }

  render() {
    return (
      <Layout>
        <SEO title="Confirm" />
        <div className="container">

          <div className="item1">
            <h1>Confirm your email.</h1>
            <div style={{ width: '20%', maxWidth: '90px', backgroundColor: '#99CCFF', height: '10px', marginBottom: `1.45rem` }}></div>
            <h3>
              Your email should be confirmed. If not, try <OutboundLink style={{ color: 'white', textDecoration: 'underline' }} href="/resend">resending</OutboundLink> the activation email. 
              Otherwise, let's <OutboundLink style={{ color: 'white', textDecoration: 'underline' }} href="/me">get started</OutboundLink>.
            </h3>
          </div>

        </div>
      </Layout>
    )
  }
}

export default Page
