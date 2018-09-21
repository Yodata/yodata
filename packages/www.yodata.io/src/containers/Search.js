import { connect } from 'react-redux'
import { createLogic } from 'redux-logic'
import escapeRegExp from 'lodash.escaperegexp'
import filter from 'lodash.filter'

// SEARCH ACTIONS
// const searchActions = {
//   'SEARCH/INIT': () => ({ type: 'SEARCH/INIT' }),
//   'SEARCH/QUERY': query => ({
//     type: 'SEARCH/QUERY',
//     payload: {
//       type: 'SearchAction',
//       instrument: { query },
//     },
//   }),
//   'SEARCH/FIND': result => ({
//     type: 'SEARCH/FIND',
//     payload: {
//       type: 'FindAction',
//       object: result,
//     },
//   }),
// }
// actionService.registerActions(searchActions)

// SEARCH LOGIC
const searchLogic = createLogic({
  type: 'SEARCH/QUERY',
  latest: true,
  validate ({ action }, allow, reject) {
    const hasQueryValue =
      action.payload &&
      action.payload.instrument &&
      action.payload.instrument.query
    if (hasQueryValue) {
      allow(action)
    }
    console.error('INVALID SEARCH QUERY', action)
    reject(action)
  },
  process ({ getState, action, getAction }, dispatch, done) {
    const query = action.payload.instrument.query
    if (query.length > 2) {
      const re = new RegExp(escapeRegExp(query), 'gi')
      const isMatch = result => re.test(result.label)
      const source = getState().db.schema
      const searchResults = filter(source, isMatch)
      dispatch(getAction('SEARCH/FIND')(searchResults))
    }
    done()
  },
})
const searchInit = createLogic({
  type: 'SEARCH/INIT',
  process ({ getAction }, dispatch, done) {
    dispatch(getAction('subscribe')('schema', '/public/schema'))
    done()
  },
})

export default [searchLogic, searchInit]

// SEARCH REDUCER
const SEARCH_INITIAL_STATE = { query: '', results: [] }
export function searchReducer (state = SEARCH_INITIAL_STATE, action) {
  switch (action.type) {
    case 'SEARCH/INIT':
      return SEARCH_INITIAL_STATE
    case 'SEARCH/QUERY':
      return {
        ...state,
        query: action.payload.instrument.query,
      }
    case 'SEARCH/FIND':
      return {
        ...state,
        results: action.payload.object,
      }
    default:
      return state
  }
}

// SEARCH CONTROLLER (REACT CONTAINER COMPONENT)
export const searchController = connect(state => ({ search: state.search }), {
  resetSearch: props => null,
  setSearchQuery: props => null,
})
