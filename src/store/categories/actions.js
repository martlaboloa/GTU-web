import createAction from '../actionHelpers'
import actionTypes from './actionTypes'

const addToSaved = id => createAction(actionTypes.saved.ADD, id)
const removeFromSaved = id => createAction(actionTypes.saved.REMOVE, id)

const addToFavourites = id => createAction(actionTypes.favourites.ADD, id)
const removeFromFavourites = id => createAction(actionTypes.favourites.REMOVE, id)

export default {
  addToSaved,
  removeFromSaved,
  addToFavourites,
  removeFromFavourites,
}
