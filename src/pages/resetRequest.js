import React from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { resetRequest } from "../services/auth"

class ResetPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({email: event.target.value})
  }

  handleSubmit(event) {
    resetRequest(this.state.email)
    event.preventDefault()
    navigate(`/tag`)
  }

  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <div className="container">

          <div className="item1">
            <h1>What du-ffel was my password?</h1>
            <div style={{ width: '20%', maxWidth: '90px', backgroundColor: '#99CCFF', height: '10px', marginBottom: `1.45rem` }}></div>
            <h3>
              Send a reset request to your email.
            </h3>
          </div>

          <div className="item2">
            <form onSubmit={this.handleSubmit}>
              <input type="email" value={this.state.value} onChange={this.handleChange} placeholder="email" />
              <div style={{ marginBottom: `1.45rem` }} />
              <button type="submit">REQUEST</button>
            </form>
          </div>
        </div>
      </Layout>
    )
  }
}

export default ResetPage
