import React from 'react'
import { SemanticToastContainer } from 'react-semantic-toasts'
import { Provider } from 'react-redux'
import 'react-semantic-toasts/styles/react-semantic-alert.css'
import Router from './Router'
import configureStore from '../store/configuration'

const store = configureStore()

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router />

        <SemanticToastContainer position="bottom-right" />
      </Provider>
    )
  }
}

export default App
