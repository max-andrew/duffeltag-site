import React from "react"
import { navigate } from "gatsby"
import { getUser, resetRequest, newUser, handleLogin, isLoggedIn } from "../services/auth"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grow from '@material-ui/core/Grow'
import Slide from '@material-ui/core/Slide'
import Link from '@material-ui/core/Link'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authFormShowLogin: true,
      email: ``,
      password: ``,
      emailError: false,
      passwordError: false,
    }
  }

  UNSAFE_componentWillMount() {
    this.handleIsLoggedIn()
  }

  async handleIsLoggedIn() {
    if (await isLoggedIn()) {
      if (getUser()["loggedInProviderName"] !== "anon-user")
        navigate(`/me`)
    }
  }

  getAuthFormHeader() {
    if (this.state.authFormShowLogin)
      return "Log in"
    return "Join"
  }

  getFlipFormButtonText() {
    if (this.state.authFormShowLogin)
      return "Create account"
    return "Log in"
  }

  flipAuthForm() {
    this.setState({
      authFormShowLogin: !this.state.authFormShowLogin
    })
  }

  emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Handle auth actions
  handleAuth(email, password) {
    // Check for valid email format
    if (!this.emailIsValid(email)) {
      this.setState({
        emailError: true,
        emailHelpText: "Invalid email"
      })
    }

    // Check for valid password format
    if (password.length < 6) {
      this.setState({
        passwordError: true,
        passwordHelpText: "Must be at least 6 characters"
      })
    }

    // Break if email or password were invalid format
    if (!this.emailIsValid(email) || password.length < 6) {
      return false
    }

    // If logging in
    if (this.state.authFormShowLogin) {
      // Log in
      handleLogin(this,{email, password})
    }
    else {
      // Create new account
      newUser(this,email,password)
    }
  }

  // Handle forgot password
  handleForgot(email) {
    this.setState({ authFormShowLogin: true })
    if (!this.emailIsValid(email)) {
      this.setState({
        emailError: true,
        emailHelpText: "Enter email to reset"
      })
    }
    else {
      // Try resetting email
      resetRequest(this,email)
    }
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.handleAuth(this.state.email,this.state.password)
  }

  render() {
    return (
      <Layout>
        <SEO title="Log In" />
        <div className="centerBody">
          <Grow in={true} mountOnEnter unmountOnExit>
            <Card className="centerItem authCard">
              <CardContent className="authCardContent">
                <Typography className="authCardTitle" variant="h5" gutterBottom>
                  { this.getAuthFormHeader() }
                </Typography>
                <form 
                  noValidate 
                  autoComplete="off"
                  method="post"
                  onSubmit={event => {
                    this.handleSubmit(event)
                  }}
                >
                  <TextField
                    id="email-input"
                    label="Email"
                    type="email"
                    name="email"
                    defaultValue={this.state.email || ''}
                    onChange={this.handleUpdate}
                    error={this.state.emailError}
                    margin="normal"
                    helperText={this.state.emailHelpText}
                  />
                  <TextField
                    id="password-input"
                    label="Password"
                    type="password"
                    name="password"
                    onChange={this.handleUpdate}
                    error={this.state.passwordError}
                    margin="normal"
                    helperText={this.state.passwordHelpText}
                  />
                  <CardActions className="authCardActions">
                    <Button type="submit" size="medium">Next</Button>
                  </CardActions>
                </form>
              </CardContent>
            </Card>
          </Grow>
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Typography className="authBodyLink">
              <Link
                component="button"
                variant="body2"
                className="authBodyLinkText"
                onClick={() => { this.flipAuthForm() }}
              >
                { this.getFlipFormButtonText() }
              </Link>
            </Typography>
          </Slide>
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Typography className="authBodyLink">
              <Link
                component="button"
                variant="body2"
                className="authBodyLinkText"
                onClick={() => { this.handleForgot(this.state.email) }}
              >
                Forgot password
              </Link>
            </Typography>
          </Slide>
        </div>
      </Layout>
    )
  }
}

export default Login