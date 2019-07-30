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
        <h1 style={{ color: 'white' }}>Save your spot.</h1>
        <div style={{ width: '20%', maxWidth: '90px', backgroundColor: '#99CCFF', height: '10px', marginBottom: `1.45rem` }}></div>
        <h3 style={{ color: 'white' }}>
          Duffeltag is coming soon. We are currently accepting reservations for the waitlist. 
          Save your spot now before your Duffeltag is gone forever.
        </h3>
      </div>

      <div className="item2">
        <div id="mc_embed_signup">
          <form action="https://gmail.us3.list-manage.com/subscribe/post?u=0cbba836ad0c7911355f5869d&amp;id=1b09a02654" 
          method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
            <div id="mc_embed_signup_scroll">
              <input style={{ border: 'none', borderRadius: '3px', height: '35px', paddingLeft: '10px', width: '10em' }} type="email" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email" required />
              <div style={{ position: 'absolute', left: '-5000px', ariaHidden: 'true' }}>
                <input type="text" name="b_0cbba836ad0c7911355f5869d_1b09a02654" tabindex="-1" value="" />
              </div>
              <div style={{ marginBottom: `1.45rem` }} />
              <button style={{ color: 'white' }} type="submit" name="reserve" id="mc-embedded-subscribe" className="button">SAVE MY SPOT</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
