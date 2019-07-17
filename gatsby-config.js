module.exports = {
  siteMetadata: {
    title: `Duffeltag`,
    description: `Handle your handles.`,
    author: `Duffeltag`,
  },
  plugins: [
    // Gatsby's data processing layer begins with “source” plugins. Here we
    // setup the site to pull data from the "documents" collection in a local
    // MongoDB instance
    {
      resolve: `gatsby-source-mongodb`,
      options: { dbName: `duffeltag`, collection: `tags`, connectionString: `mongodb://max:92LcggDxpsbz8aN@ds245927.mlab.com:45927/duffeltag` },
    },
    `gatsby-plugin-react-helmet`,
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
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
