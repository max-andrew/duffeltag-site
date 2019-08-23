import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { resetPassword } from "../services/auth"

class ResetPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({password: event.target.value})
  }

  handleSubmit(event) {
    resetPassword(this.state.password)
    event.preventDefault()
    alert("Password updated. Try logging in.")
    // navigate(`/tag`)
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
              Add your new password to keep on taggin'.
            </h3>
          </div>

          <div className="item2">
            <form onSubmit={this.handleSubmit}>
              <input type="password" value={this.state.value} onChange={this.handleChange} placeholder="new password" />
              <div style={{ marginBottom: `1.45rem` }} />
              <button type="submit">RESET</button>
            </form>
          </div>
        </div>
      </Layout>
    )
  }
}

export default ResetPage
