// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  if (page.path.match(/^\/tag/)) {
    page.matchPath = "/tag/*"

    // Update the page.
    createPage(page)
  }
}