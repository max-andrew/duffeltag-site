import React from "react"
import { getUser } from "../services/auth"

const Profile = () => (
  <>
    <h2>{getUser().name}</h2>
    <ul>
      <li>Name: {getUser().name}</li>
      <li>E-mail: {getUser().email}</li>
    </ul>
  </>
)

export default Profile