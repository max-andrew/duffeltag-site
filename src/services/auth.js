import { navigate } from "gatsby"

const {
  Stitch,
  AnonymousCredential,
  UserPasswordCredential,
  UserPasswordAuthProviderClient,
  resendConfirmationEmail,
  logoutUserWithId
} = require('mongodb-stitch-browser-sdk')

// Stitch values
const APP_ID = "duffeltag-ceqsw"
// Initialize client if none exists
const app = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID)

/* AUTH FUNCTIONS */

export const isBrowser = () => typeof window !== "undefined"

// Get user values
export const getUser = () => app.auth.user
  /*isBrowser() && window.localStorage.getItem(LOCAL_STITCH_KEY)
    ? JSON.parse(window.localStorage.getItem(LOCAL_STITCH_KEY))
    : {} */

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
  return new Promise(resolve => {
    // Allow users to log in anonymously
    const credential = new AnonymousCredential();
    resolve(app.auth.loginWithCredential(credential));
  })
}

/*export async function logInAnon() {
  if (!isLoggedIn()) {
    return await loginAnonymous()
  }
}*/

export async function logOutAnon() {
    const localUser = getUser()
    if (localUser !== undefined) {
      if (localUser["loggedInProviderName"] === "anon-user")
        return logoutCurrentUser()
    }
}

export const handleLogin = ({ email, password }) => {
  const credential = new UserPasswordCredential(email, password)

  app.auth.loginWithCredential(credential)

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
      resolve(app.auth.logoutUserWithId(user))
    }
  })
}

const logoutAll = () => app.auth.logout()

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
  const emailPassClient = Stitch.defaultAppClient.auth
  .getProviderClient(UserPasswordAuthProviderClient.factory);

  emailPassClient.sendResetPasswordEmail(email).then(() => {
    console.log("Successfully sent password reset email!");
  }).catch(err => {
    console.log("Error sending password reset email:", err);
  });
}

export const resetPassword = userNewPassword => {
  // Parse the URL query parameters
  const url = window.location.search;
  const params = new URLSearchParams(url);

  const token = params.get('token');
  const tokenId = params.get('tokenId');
  const newPassword = userNewPassword;

  // Confirm the user's email/password account
  const emailPassClient = app.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory);

  emailPassClient.resetPassword(token, tokenId, newPassword).then(() => {
    console.log("Successfully reset password!");
  }).catch(err => {
    console.log("Error resetting password:", err);
  });
}

// Add new user
export const newUser = userEmailPassword => {
  const emailPassClient = app.auth
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

// Confirm email
export const confirmEmail = () => {
  // Parse the URL query parameters
  const url = window.location.search;
  const params = new URLSearchParams(url);
  const token = params.get('token');
  const tokenId = params.get('tokenId');

  // Confirm the user's email/password account
  const emailPassClient = Stitch.defaultAppClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory);

  return emailPassClient.confirmUser(token, tokenId);
}

// Resend activation email
export const resendActivationEmail = userEmail => {
  const emailPassClient = app.auth
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
