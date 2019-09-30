module.exports = {
  siteMetadata: {
    title: `Duffeltag`,
    description: `Handle your handles.`,
    author: `Duffeltag`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    'gatsby-plugin-remove-serviceworker',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-144323653-1",
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-mongodb`,
      options: { 
        connectionString: `mongodb+srv://max:kJi505C&iin4@cluster0-z5eqg.mongodb.net`,
        dbName: `duffeltag`, 
        collection: `users`, 
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
