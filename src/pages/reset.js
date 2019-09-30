import React from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { resetPassword } from "../services/auth"
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grow from '@material-ui/core/Grow'

class ResetPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: ''
    }
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    resetPassword(this.state.password).then(navigate(`/login`))
  }

  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <div className="centerBody">
          <Grow in={true} mountOnEnter unmountOnExit>
            <Card className="centerItem authCard">
              <CardContent className="authCardContent">
                <Typography className="authCardTitle" variant="h5" gutterBottom>
                  Reset password
                </Typography>
                <form method="post" onSubmit={event => { this.handleSubmit(event) }}>
                  <TextField
                    id="password-input"
                    label="New password"
                    type="password"
                    name="password"
                    onChange={this.handleUpdate}
                    error={this.state.passwordError}
                    margin="normal"
                    helperText={this.state.passwordHelpText}
                  />
                  <CardActions className="authCardActions">
                    <Button type="submit" size="medium">Reset</Button>
                  </CardActions>
                </form>
              </CardContent>
            </Card>
          </Grow>
        </div>
      </Layout>
    )
  }
}

export default ResetPage
