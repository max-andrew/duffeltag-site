import React from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { newUser } from "../services/auth"

class ResetPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }

    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmail(event) {
    this.setState({email: event.target.value})
  }

  handlePassword(event) {
    this.setState({password: event.target.value})
  }

  handleSubmit(event) {
    newUser([this.state.email,this.state.password])
    event.preventDefault()
  }

  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <div className="container">

          <div className="item1">
            <h1>Get your Duffeltag now.</h1>
            <div style={{ width: '20%', maxWidth: '90px', backgroundColor: '#99CCFF', height: '10px', marginBottom: `1.45rem` }}></div>
            <h3>
              You're so close to saving your Duffeltag. 
              We just need to know like two things about you.
            </h3>
          </div>

          <div className="item2">
            <form onSubmit={this.handleSubmit}>
              <input type="email" value={this.state.email} onChange={this.handleEmail} placeholder="email" />
              <div style={{ marginBottom: `1.45rem` }} />
              <input type="password" value={this.state.password} onChange={this.handlePassword} placeholder="password" />
              <br />
              <label style={{ fontSize: '12px' }}>Must be at least 6 characters</label>
              <div style={{ marginBottom: `1.45rem` }} />
              <button type="submit">JOIN</button>
            </form>
          </div>
        </div>
      </Layout>
    )
  }
}

export default ResetPage
