
import React from 'react'
import Card from './BasicCard'
import FieldEditable from './FieldEditable'

export const TypeCard = props => {
  let url = `http://schema.org/${props.subject.label}`
  let meta = <a href={url}>{url}</a>
  return (
    <Card
      header={props.subject.label}
      meta={meta}
      description={
        <FieldEditable
          entity={`/public/schema/${props.subject.label}`}
          attribute="description"
          value={props.subject.description}
        />
      }
      extra={props.extra}
    />
  )
}

export default TypeCard
