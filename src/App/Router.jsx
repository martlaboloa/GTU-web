import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import Layout from '../features/Layout'
import Discover from '../features/Discover'
import Saved from '../features/Saved'
import Favourites from '../features/Favourites'
import ManageCategories from '../features/ManageCategories'

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/discover" />}
          />

          <Route path="/discover" component={Discover} />

          <Route path="/saved" component={Saved} />

          <Route path="/favourites" component={Favourites} />

          <Route path="/manage-categories" component={ManageCategories} />
        </Layout>
      </BrowserRouter>
    )
  }
}

export default Router
