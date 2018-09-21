import React from 'react'
import { Header } from 'semantic-ui-react'

export default function SplitHeader ({content, subheader, children, ...rest}) {
  const twoColumnStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top',
    paddingTop: '1em',
    paddingBottom: '1em',
  }
  return (
    <div style={twoColumnStyle}>
      <Header {...{content, subheader, ...rest}} />
      {children && <div>{children}</div>}
    </div>
  )
}
