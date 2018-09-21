import React from 'react'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { Menu, UserButton, Input } from './index'
import { searchController } from '../containers/Search'

const Search = props => (
  <div>
    <form onSubmit={() => {
      return false
    }}>
      <Input
        id="app_search"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onFocus={props.onFocus}
        icon="search"
      />
    </form>
  </div>
)

const SearchInput = searchController(({search, resetSearch, setSearchQuery}) => (
  <Search
    onChange={event => setSearchQuery(event.target.value)}
    onFocus={resetSearch}
    value={search.query}
  />
))

const Appbar = props =>
  <div className="ui menu">
    <Menu.Item icon="bars" onClick={props.toggleNav}/>
    <Menu.Item header={true}>Yodata</Menu.Item>
  </div>

export default compose(
  connect(state => ({})),
  withHandlers({
    toggleNav: ({ dispatch }) => () => {
      dispatch({ type: '@@Appbar/TOGGLE_NAV' })
    },
  })
)(Appbar)
