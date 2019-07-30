import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import { getUser, isLoggedIn } from "../services/auth"

import Layout from "../components/layout"
import SEO from "../components/seo"
import NavBar from "../components/nav-bar"
import BlankTag from "../components/blank_tag"

export default ({ data }) => (
  <Layout>
    <SEO title="Reserve Tag" />
    <NavBar />
    <h1>Hello {isLoggedIn() ? getUser().name : "world"}!</h1>
    <p>
      {isLoggedIn() ? (
        <>
          <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
            <BlankTag />
          </div>
          You are logged in, so check your{" "}
          <Link to="/app/profile">profile</Link>
        </>
      ) : (
        <>
          You should <Link to="/app/login">log in</Link> to see restricted
          content
        </>
      )}
    </p>
    <p>About {data.site.siteMetadata.title}</p>
  </Layout>
)

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`