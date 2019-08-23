import React from "react"
import { navigate } from "gatsby"
import { OutboundLink } from 'gatsby-plugin-google-analytics'
import { handleLogin, isLoggedIn } from "../services/auth"
import Layout from "../components/layout"
import SEO from "../components/seo"

class Login extends React.Component {
  state = {
    username: ``,
    password: ``
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    handleLogin(this.state)
  }

  render() {
    if (isLoggedIn()) {
      navigate(`/me`)
    }

    return (
      <Layout>
        <SEO title="Log In" />
        <h1>Log in</h1>
        <form
          method="post"
          onSubmit={event => {
            this.handleSubmit(event)
          }}
        >
          <label>
            Email {" "}
            <br />
            <input type="email" name="email" onChange={this.handleUpdate} />
          </label>
          <br /><br />
          <label>
            Password {" "}
            <br />
            <input
              type="password"
              name="password"
              onChange={this.handleUpdate}
            />
          </label>
          <br /><br />
          <input type="submit" value="Log In" />
        </form>
        <OutboundLink style={{ textDecoration: 'underline', color: 'white', padding: '.25rem .125em', fontSize: '1rem' }} href="/join">
          Sign up
        </OutboundLink>
        {' | '}
        <OutboundLink style={{ textDecoration: 'underline', color: 'white', padding: '.25rem .125em', fontSize: '1rem' }} href="/resetRequest">
          Forgot password
        </OutboundLink>
        <br />
        <OutboundLink style={{ textDecoration: 'underline', color: 'white', padding: '.25rem .125em', fontSize: '1rem' }} href="/resend">
          Resend Activation Email
        </OutboundLink>
      </Layout>
    )
  }
}

export default Login