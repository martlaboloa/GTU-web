/* global describe, it, expect */
/* eslint no-undef: "error" */
import reducer from '../store/categories/reducer'
import actionTypes from '../store/categories/actionTypes'

describe('categories reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      saved: [],
      favourites: [],
      customCategories: {},
    })
  })

  it('should handle adding and removing to and from saved and favourite categories', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.saved.ADD,
        payload: '111',
      }),
    ).toEqual({
      saved: ['111'],
      favourites: [],
      customCategories: {},
    })

    expect(
      reducer(undefined, {
        type: actionTypes.saved.REMOVE,
        payload: '111',
      }),
    ).toEqual({
      saved: [],
      favourites: [],
      customCategories: {},
    })

    expect(
      reducer(undefined, {
        type: actionTypes.favourites.ADD,
        payload: '222',
      }),
    ).toEqual({
      saved: [],
      favourites: ['222'],
      customCategories: {},
    })

    expect(
      reducer(undefined, {
        type: actionTypes.favourites.REMOVE,
        payload: '222',
      }),
    ).toEqual({
      saved: [],
      favourites: [],
      customCategories: {},
    })
  })
})
