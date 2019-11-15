import callApi from '../callApi'
import { GOOGLE_API_KEY, GOOGLE_BOOKS_BASE_URL } from '../../constants'

export const queryVolumeById = ({ id }) => callApi({
  url: `${GOOGLE_BOOKS_BASE_URL}/volumes/${id}`,
  method: 'get',
  params: { key: GOOGLE_API_KEY },
})

export const queryVolumes = ({
  queryString,
  maxResults = 10,
  startIndex = 0,
}) => callApi({
  url: `${GOOGLE_BOOKS_BASE_URL}/volumes?q=${queryString}`,
  method: 'get',
  params: {
    key: GOOGLE_API_KEY,
    maxResults,
    startIndex,
  },
})
