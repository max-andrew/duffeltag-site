import { OutboundLink } from "gatsby-plugin-google-analytics"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header
    style={{
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <p style={{ fontFamily: "Circular-Black", margin: 0, textAlign: 'center', lettingSpacing: '100px' }}>
        <OutboundLink
          href="/"
          style={{
            color: `white`,
            textDecoration: `none`,
            textTransform: 'uppercase',
            fontSize: '28px',
          }}
        >
          {siteTitle}
        </OutboundLink>
      </p>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
