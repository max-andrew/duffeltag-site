import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>Taggonit!</h1>
    <p>Something went wrong and this link didn't work.</p>
  </Layout>
)

export default NotFoundPage
