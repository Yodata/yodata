import React from 'react'
import { Router } from 'react-static'
import { hot } from 'react-hot-loader'
import Routes from 'react-static-routes'
import { Provider } from 'react-redux'
import withAuthentication from './session/withAuthentication'
import { HotKeys } from 'react-hotkeys'
import store from './connectors'
import Layout from './containers/Layout'

import 'semantic-ui-css/semantic.min.css'
import './app.css'

const keyMap = {
  'controlF': 'ctrl+f',
}

const hotKeyHandlers = {
  'controlF': event => {
    window.document.getElementById('app_search').focus()
  },
}

const App = withAuthentication(() => (
  <Provider store={store}>
    <Router>
      <HotKeys keyMap={keyMap} handlers={hotKeyHandlers}>
        <Layout>
          <Routes />
        </Layout>
      </HotKeys>
    </Router>
  </Provider>
))

export default hot(module)(App)
