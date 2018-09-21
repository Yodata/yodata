import { Sidebar, Menu } from 'semantic-ui-react'
import { MenuItem } from './MenuItem'

const drawer = {
  open: true,
}

export default ({items = []}) => (
  <Sidebar
    as={Menu}
    animation="push"
    width="thin"
    visible={drawer.open}
    icon="labeled"
    vertical
    inverted
    style={{paddingTop: '76px'}}
  >{items && items.map(MenuItem)}</Sidebar>
)
