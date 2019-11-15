const getCategories = state => state.categories
const getSaved = state => state.account.saved
const getFavourites = state => state.account.Favourites
const getCustomCategories = state => state.customCategories

const getCustomCategory = (state, categoryId) => getCustomCategories(state)[categoryId]

const getSavedBookIds = state => getCategories(state).saved
const getFavouritesBookIds = state => getCategories(state).favourites


export default {
  getCategories,
  getSaved,
  getFavourites,
  getCustomCategories,
  getCustomCategory,
  getSavedBookIds,
  getFavouritesBookIds,
}
