import React from 'react'
import NotificationSytem from 'react-notification-system'
import {createAction} from 'redux-actions'
import {connect} from 'react-redux'

export const send = createAction('NOTIFICATIONS/SEND')

const notificationsInitialState = {
  next: null,
}

export function notificiationsReducer (state = notificationsInitialState, action) {
  switch (action.type) {
    case 'NOTIFICATIONS/ADD':
      return {
        ...state,
        next: action.payload,
      }
    default:
      return state
  }
}

class Notifications extends React.Component {
  constructor (props) {
    super(props)
    this._notificationSytem = null
  }

  componentWillReceiveProps ({notifications}) {
    if (notifications && notifications.next) {
      this._notificationSystem.addNotification(notifications.next)
    }
  }

  componentDidMount () {
    this._notificationSystem = this.refs.notificationSystem
  }

  render () {
    return <NotificationSytem ref="notificationSystem"/>
  }
}

export default connect(state => ({notifications: state.notifications}))(Notifications)
