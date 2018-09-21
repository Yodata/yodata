import { Link } from 'react-static'
import { MenuItem } from 'semantic-ui-react'

export default ({name, icon, label}) => (
  <Link to={name}>
    <MenuItem>
      <Icon name={icon} />
      {label}
    </MenuItem>
  </Link>
)
