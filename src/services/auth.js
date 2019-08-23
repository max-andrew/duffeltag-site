import { navigate } from "gatsby"

export const isBrowser = () => typeof window !== "undefined"

// Stitch values
const APP_ID = "duffeltag-ceqsw"

// Wrap the require in check for window
const getApp = () => {
  if (isBrowser()) {
    const {
      Stitch,
      UserPasswordAuthProviderClient,
      resendConfirmationEmail,
      logoutUserWithId
    } = require('mongodb-stitch-browser-sdk')

    // Initialize client if none exists
    return app = Stitch.hasAppClient(APP_ID)
      ? Stitch.getAppClient(APP_ID)
      : Stitch.initializeAppClient(APP_ID)
  }
}

/* AUTH FUNCTIONS */

// Get user values
export const getUser = () => isBrowser() ? getApp().auth.user : {}

export const getUserId = () => {
  // getUser().user_id
  if(typeof getUser() !== "undefined") {
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

export async function logOutAnon() {
    const localUser = getUser()
    if (localUser !== undefined) {
      if (localUser["loggedInProviderName"] === "anon-user")
        return logoutCurrentUser()
    }
}

export const handleLogin = ({ email, password }) => {
  var credential = null
  if (isBrowser()) {
    const { UserPasswordCredential } = require('mongodb-stitch-browser-sdk')
    credential = new UserPasswordCredential(email, password)
  }

  getApp().auth.loginWithCredential(credential)

  // Returns a promise that resolves to the authenticated user
  .then(authedUser => logInSuccess(authedUser))
  .catch(err => console.error(`login failed with error: ${err}`))
}

export const logInSuccess = authedUser => {
  console.log(`Successfully logged in with id: ${authedUser.id}`)
  setUser(authedUser)
  navigate(`/me`)
}

export const isLoggedIn = () => {
  const user = getUserId()
  return !!user
}

// Log out user
export function logoutCurrentUser() {
  return new Promise(resolve => {
    // Log out the currently logged in user (if there is one)
    const user = getUserId()
    console.log(user)
    if(user) {
      resolve(getApp().auth.logoutUserWithId(user))
    }
  })
}

const logoutAll = () => getApp().auth.logout()

export const handleLogout = () => {
  logoutCurrentUser(getUserId())
  purgeAuthInfos()
  console.log("Successfully logged out. See ya.")
  navigate('/login')
};

const purgeAuthInfos = () =>
  window.localStorage.removeItem("__stitch.client."+APP_ID+".all_auth_infos")

// Reset password
export const resetRequest = email => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    const emailPassClient = getApp().defaultAppClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory);

    emailPassClient.sendResetPasswordEmail(email).then(() => {
      console.log("Successfully sent password reset email!");
    }).catch(err => {
      console.log("Error sending password reset email:", err);
    });
  }
}

export const resetPassword = userNewPassword => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    // Parse the URL query parameters
    const url = window.location.search;
    const params = new URLSearchParams(url);

    const token = params.get('token');
    const tokenId = params.get('tokenId');
    const newPassword = userNewPassword;

    // Confirm the user's email/password account
    const emailPassClient = getApp().auth
      .getProviderClient(UserPasswordAuthProviderClient.factory);

    emailPassClient.resetPassword(token, tokenId, newPassword).then(() => {
      console.log("Successfully reset password!");
    }).catch(err => {
      console.log("Error resetting password:", err);
    });
  }
}

// Add new user
export const newUser = userEmailPassword => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    const emailPassClient = getApp().auth
      .getProviderClient(UserPasswordAuthProviderClient.factory);

    emailPassClient.registerWithEmail(userEmailPassword[0], userEmailPassword[1])
      .then(() => {
         console.log("Successfully sent account confirmation email!");
         navigate(`/login`)
      })
      .catch(err => {
         console.log("Error registering new user:", err);
         alert("Error registering, please check your email and password.")
      });
  }
}

// Confirm email
export const confirmEmail = () => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')

    // Parse the URL query parameters
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

    // Confirm the user's email/password account
    const emailPassClient = getApp().defaultAppClient.auth
      .getProviderClient(UserPasswordAuthProviderClient.factory);

    return emailPassClient.confirmUser(token, tokenId);
  }
}

// Resend activation email
export const resendActivationEmail = userEmail => {
  if (isBrowser()) {
    const { UserPasswordAuthProviderClient } = require('mongodb-stitch-browser-sdk')
    const emailPassClient = getApp().auth
      .getProviderClient(UserPasswordAuthProviderClient.factory);

    emailPassClient.resendConfirmationEmail(userEmail)
      .then(() => {
        console.log("Successfully sent account confirmation email!");
        navigate(`/login`)
      })
      .catch(err => {
        console.log("Error registering new user:", err);
        alert("Error registering, please check your email.")
      });
  }
}
