import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

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
              <input type="email" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email" required />
              <div style={{ position: 'absolute', left: '-5000px', ariaHidden: 'true' }}>
                <input type="text" name="b_0cbba836ad0c7911355f5869d_1b09a02654" tabindex="-1" value="" />
              </div>
              <div style={{ marginBottom: `1.45rem` }} />
              <button type="submit" name="reserve" id="mc-embedded-subscribe" className="button">SAVE MY SPOT</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
