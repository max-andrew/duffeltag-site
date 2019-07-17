import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <h1>Handle your handles.</h1>
      <div>
      </div>
      <h4>
        Meeting someone new? Don’t give them 10 handles. 
        Give them your Duffletag. They can access all your 
        profiles with just one username. That’s handy.
      </h4>
      <button>
        <Link to="/tag/">GET DUFFLETAG</Link>
      </button>
    </div>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      {/* <Image /> */}
    </div>
  </Layout>
)

export default IndexPage
