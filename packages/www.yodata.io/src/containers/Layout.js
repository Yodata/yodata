import React, { Component } from 'react'
import { Container, MenuItem, Notifications } from '../components'
import { Sidebar, Menu } from 'semantic-ui-react'
import { routes } from 'react-static-routes'

export default class Layout extends Component {
  state = { visible: true }
  handleButtonClick = () => this.setState({ visible: !this.state.visible })
  handleSidebarHide = () => this.setState({ visible: false })
  render() {
    const { visible } = this.state
    return (
      <div className="layout">
        <Container fluid style={{ height: '100vh' }}>
          <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="push"
            width="thin"
            visible={visible}
            icon="labeled"
            vertical
            inverted
            style={{paddingTop: '76px'}}
            >{this.props.items && this.props.items.map(MenuItem)}</Sidebar>
            <Sidebar.Pusher>
              <div className="ui container">
                {this.props.children}
              </div>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Container>
        <Notifications />
      </div>
    )
  }
}
