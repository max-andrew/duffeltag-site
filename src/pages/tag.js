import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

// export default ({ frontmatter: { title, date } }) => (
const TagPage = () => (
  <Layout>
    <SEO title="Tag Page" />
  </Layout>
)

export default TagPage


/*export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
        }
      }
    }
  }
`*/