import React from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { resendActivationEmail } from "../services/auth"

class ResetPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }

    this.handleEmail = this.handleEmail.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmail(event) {
    this.setState({email: event.target.value})
  }

  handleSubmit(event) {
    resendActivationEmail(this.state.email)
    event.preventDefault()
  }

  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <div className="container">

          <div className="item1">
            <h1>Resend your confirmation email.</h1>
            <div style={{ width: '20%', maxWidth: '90px', backgroundColor: '#99CCFF', height: '10px', marginBottom: `1.45rem` }}></div>
            <h3>
              Be sure to activate your account as soon as possible. Look for "Duffeltag" in the subject line.
            </h3>
          </div>

          <div className="item2">
            <form onSubmit={this.handleSubmit}>
              <input type="email" value={this.state.email} onChange={this.handleEmail} placeholder="email" />
              <div style={{ marginBottom: `1.45rem` }} />
              <button type="submit">RESEND</button>
            </form>
          </div>
        </div>
      </Layout>
    )
  }
}

export default ResetPage
