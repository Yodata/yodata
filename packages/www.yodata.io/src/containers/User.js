import React from 'react'
import { withRouteData } from 'react-static'
//

export default withRouteData(({ user }) => (
  <div>
    <h1>{user._id}</h1>
    <p>{user.name}</p>
  </div>
))
