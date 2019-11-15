import React from 'react'
import reduce from 'lodash/reduce'
import update from 'immutability-helper'
import webAPI from './webAPI'

const webAPIProvider = (withPendingState = true) => WrappedComponent => {
  if (withPendingState) {
    return class WrapperWebAPIProvider extends React.Component {
      constructor(props) {
        super(props)

        this.state = {
          webAPIPending: { ...Object.keys(webAPI).reduce((acc, cur) => ({ ...acc, [`${cur}Pending`]: {} }), {}) },
          wrappedWebAPI: reduce(
            webAPI,
            (requestFuncGroupAcc, requestFuncGroup, requestFuncGroupKey) => ({
              ...requestFuncGroupAcc,
              [requestFuncGroupKey]: reduce(
                requestFuncGroup,
                (requestFuncAcc, requestFunc, requestFuncName) => ({
                  ...requestFuncAcc,
                  [requestFuncName]: this.wrapRequestFunc(requestFunc, requestFuncGroupKey, requestFuncName),
                }),
                {},
              ),
            }),
            {},
          ),
        }
      }

      wrapRequestFunc (func, requestFuncGroupKey, requestFuncName) {
        return ({ pendingName, ...restConfig }) => {
          const pendingStateName = !pendingName ? `${requestFuncName}Pending` : pendingName

          this.setRequestFuncPending(requestFuncGroupKey, pendingStateName, true)

          return func(restConfig).finally(() => {
            this.setRequestFuncPending(requestFuncGroupKey, pendingStateName, false)
          })
        }
      }

      setRequestFuncPending(requestFuncGroupKey, pendingStateName, value) {
        this.setState(state => ({
          webAPIPending: update(state.webAPIPending, { [`${requestFuncGroupKey}Pending`]: { [`${pendingStateName}`]: { $set: value } } }),
        }))
      }

      render() {
        const { wrappedWebAPI, webAPIPending } = this.state

        return <WrappedComponent {...this.props} webAPI={wrappedWebAPI} webAPIPending={webAPIPending} />
      }
    }
  }

  return class WrapperWebAPIProvider extends React.Component {
    render() {
      return <WrappedComponent {...this.props} webAPI={webAPI} />
    }
  }
}

export default webAPIProvider
