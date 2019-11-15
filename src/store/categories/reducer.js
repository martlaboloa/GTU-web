import actionTypes from './actionTypes'

export const initialState = {
  saved: [],
  favourites: [],
  customCategories: {},
}

const categories = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.saved.ADD:
    return { ...state, ...(!state.saved.includes(action.payload) && { saved: [...state.saved, action.payload] }) }
  case actionTypes.saved.REMOVE:
    return { ...state, ...(state.saved.includes(action.payload) && { saved: state.saved.filter(nextId => nextId !== action.payload) }) }
  case actionTypes.favourites.ADD:
    return { ...state, ...(!state.favourites.includes(action.payload) && { favourites: [...state.favourites, action.payload] }) }
  case actionTypes.favourites.REMOVE:
    return { ...state, ...(state.favourites.includes(action.payload) && { favourites: state.favourites.filter(nextId => nextId !== action.payload) }) }
  default:
    return state
  }
}


export default categories
