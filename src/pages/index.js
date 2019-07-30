import React from "react"
import { OutboundLink } from 'gatsby-plugin-google-analytics'

import Layout from "../components/layout"
import SEO from "../components/seo"
import DanTag from "../components/dan_tag"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className="container">

      <div className="item1">
        <h1 style={{ color: 'white' }}>Handle your handles.</h1>
        <div style={{ width: '20%', maxWidth: '90px', backgroundColor: '#99CCFF', height: '10px', marginBottom: `1.45rem` }}></div>
        <h3 style={{ color: 'white' }}>
          Meeting someone new? Don’t give them 10 handles. 
          Give them your Duffeltag. They can access all your 
          profiles with just one username. That’s handy.
        </h3>
        <button>
          <OutboundLink style={{ color: 'white', padding: '.25rem .125em', fontSize: '1.125rem' }} href="/reserve">
            GET DUFFELTAG
          </OutboundLink>
        </button>
      </div>

      <div className="item2">
        <DanTag />
      </div>
    </div>
  </Layout>
)

export default IndexPage
