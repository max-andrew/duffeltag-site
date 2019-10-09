import { navigate } from "gatsby"

export const isBrowser = () => typeof window !== "undefined"

// Stitch values
export const APP_ID = "duffeltag-ceqsw"

// Wrap the require in check for window
export const getApp = () => {
  if (isBrowser()) {
    const {
      Stitch,
      /*resendConfirmationEmail,
      logoutUserWithId*/
    } = require('mongodb-stitch-browser-sdk')

    // Initialize client if none exists
    return Stitch.hasAppClient(APP_ID)
      ? Stitch.getAppClient(APP_ID)
      : Stitch.initializeAppClient(APP_ID)
  }
}

/* AUTH FUNCTIONS */

// Get user values
export const getUser = () => isBrowser() ? getApp().auth.user : {}

export const getUserId = () => {
  // getUser().user_id
  if (typeof getUser() !== "undefined") {
    return getUser().id
  }
}

// Set user values
const setUser = user => window.localStorage.setItem("user", user)

// Log in user
export function loginAnonymous() {
  var credential = null
  if (isBrowser()) {
    const { AnonymousCredential } = require('mongodb-stitch-browser-sdk')
    credential = new AnonymousCredential()
  }
  return new Promise(resolve => {
    // Allow users to log in anonymously
    resolve(getApp().auth.loginWithCredential(credential))
  })
}

export function logOutAnon() {
  const localUser = getUser()
  if (localUser !== undefined) {
    return new Promise(resolve => {
      if (localUser["loggedInProviderName"] === "anon-user")
        return logoutCurrentUser()
    })
  }
}

export const handleLogin = (thisPage,{ email, password }) => {
  var credential = null
  if (isBrowser()) {
    const { UserPasswordCredential } = require('mongodb-stitch-browser-sdk')
    credential = new UserPasswordCredential(email, password)
  }

  getApp().auth.loginWithCredential(credential)

  // Returns a promise that resolves to the authenticated user
  .then(authedUser => logInSuccess(authedUser))
  .catch(err => logInFail(thisPage,email,err))
}

const logInSuccess = authedUser => {
  // console.log(`Successfully logged in with id: ${authedUser.id}`)
  setUser(authedUser)
  navigate(`/me`)
}

const logInFail = (thisPage,email,error) => {
  console.error(`Login failed with error: ${error}`)
  console.log(error)
  if (error.message === "invalid username/password") {
    thisPage.setState({
      emailError: true,
      emailHelpText: "Invalid email or password",
      passwordError: true
    })
  }
  else if (error.message === "confirmation required") {
    thisPage.setState({
      emailError: true,
      emailHelpText: "Check email for activation link",
      passwordError: false
    })
    resendActivationEmail(email)
  }
  else {
    thisPage.setState({
      emailError: true,
      emailHelpText: "Error logging in",
      passwordError: true
    })
  }
}

export async function isLoggedIn() {
  const user = await getUserId()
  return !!user
}

// Log out user
export function logoutCurrentUser() {
  return new Promise(resolve => {
    // Log out the currently logged in user (if there is one)
    const user = getUserId()
    if(user) {
      resolve(getApp().auth.logoutUserWithId(user))
    }
  })
}

// const logoutAll = () => getApp().auth.logout()

export const handleLogout = () => {
  logoutCurrentUser(getUserId()).then(purgeAuthInfos()).then(() => {
    console.log("Successfully logged out. See ya.")
    navigate('/login')
  })
}

const purgeAuthInfos = () =>
  window.localStorage.removeItem("__stitch.client."+APP_ID+".all_auth_infos")

// Add new user
export const newUser = (thisPage,email,password) => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    const emailPassClient = getApp().auth
      .getProviderClient(UserPasswordAuthProviderClient.factory)

    emailPassClient.registerWithEmail(email, password)
      .then(() => { newUserSuccess(thisPage) })
      .catch(err => { newUserFail(thisPage,email,err) })
  }
}

// Log message and set state
const newUserSuccess = (thisPage) => {
  thisPage.setState({
    authFormShowLogin: true,
    emailError: false,
    emailHelpText: "Check email for activation link",
    passwordHelpText: "",
    passwordError: false
  })
}

// Log message and set state
const newUserFail = (thisPage,email,error) => {
  console.log("Error registering new user:", error)
  if (error.message === "name already in use") {
    thisPage.setState({
      authFormShowLogin: true,
      emailError: false,
      emailHelpText: "Account exists, try again",
      passwordHelpText: "",
      passwordError: false
    })
    resendActivationEmail(email)
  }
  else if (error.message === "already confirmed") {
    thisPage.setState({
      authFormShowLogin: true,
      emailError: false,
      emailHelpText: "Email confirmed, try again",
      passwordHelpText: "",
      passwordError: false
    })
    resendActivationEmail(email)
  }
  else {
    thisPage.setState({
      emailError: true,
      emailHelpText: "Error signing up",
      passwordError: true
    })
  }
}

// Resend activation email
export const resendActivationEmail = userEmail => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')
    const emailPassClient = getApp().auth
      .getProviderClient(UserPasswordAuthProviderClient.factory)

    emailPassClient.resendConfirmationEmail(userEmail)
      .then(() => {
        console.log("Successfully sent account confirmation email!")
      })
      .catch(err => {
        console.log("Error registering new user:", err)
      })
  }
}

// Request password reset
export const resetRequest = (thisPage,email) => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    const emailPassClient = getApp().auth
    .getProviderClient(UserPasswordAuthProviderClient.factory)

    emailPassClient.sendResetPasswordEmail(email).then(() => {
      resetPasswordRequestSuccess(thisPage)
    }).catch(err => {
      resetPasswordRequestFail(thisPage,err)
    })
  }
}

// Log message and set state
const resetPasswordRequestSuccess = (thisPage) => {
  console.log("Successfully sent password reset email!")
  thisPage.setState({
    emailError: false,
    emailHelpText: "Check email for reset link"
  })
}

// Log message and set state
const resetPasswordRequestFail = (thisPage,err) => {
  console.log("Error sending password reset email:", err)
  if (err.errorCode === 44) {
    thisPage.setState({
      emailError: true,
      emailHelpText: "Account not found"
    })
  }
  else {
    thisPage.setState({
      emailError: true,
      emailHelpText: "Error resetting password"
    })
  }
}

// Reset password
export async function resetPassword(userNewPassword) {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    // Parse the URL query parameters
    const url = window.location.search
    const params = new URLSearchParams(url)

    const token = params.get('token')
    const tokenId = params.get('tokenId')
    const newPassword = userNewPassword

    // Confirm the user's email/password account
    const emailPassClient = getApp().auth
      .getProviderClient(UserPasswordAuthProviderClient.factory)

    emailPassClient.resetPassword(token, tokenId, newPassword).then(() => {
    console.log("Successfully reset password!")
    }).catch(err => {
      console.log("Error resetting password:", err)
    })
  }
}

// Confirm email
export const confirmEmail = () => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    // Parse the URL query parameters
    const url = window.location.search
    const params = new URLSearchParams(url)
    const token = params.get('token')
    const tokenId = params.get('tokenId')

    // Confirm the user's email/password account
    const emailPassClient = getApp().auth
      .getProviderClient(UserPasswordAuthProviderClient.factory)

    return emailPassClient.confirmUser(token, tokenId)
  }
}
