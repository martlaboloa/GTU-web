import axios from 'axios'

function callApi (config) {
  return axios.request(config)
    .then(
      ({ data }) => {
        return data
      },
    )
    .catch(({ response: { data } }) => {
      return Promise.reject(data)
    })
}

export default callApi
