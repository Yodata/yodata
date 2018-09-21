// @flow

import React from 'react'
import {compose, withHandlers, withState} from 'recompose'
import isFunction from 'lodash.isFunction'
import {Form, TextArea} from 'semantic-ui-react'

const fieldEditableContainer = compose(
  withState('fieldEditable', 'setFieldEditable', {editing: false}),
  withHandlers({
    handleFocus: ({entity, attribute, value, fieldEditable, setFieldEditable}) => e => {
      setFieldEditable({
        ...fieldEditable,
        entity,
        attribute,
        value,
        nextValue: value,
        editing: true,
      })
    },
    handleInput: ({fieldEditable, setFieldEditable}) => (e, data) => {
      setFieldEditable({
        ...fieldEditable,
        editing: true,
        nextValue: data.value,
      })
    },
    saveChanges: ({fieldEditable, setFieldEditable, onChange, dispatch}) => () => {
      let {entity, attribute, value, nextValue} = fieldEditable
      dispatch({
        type: 'DB/PATCH',
        payload: {entity, attribute, nextValue},
      })
      if (isFunction(onChange)) {
        onChange({entity, attribute, value, nextValue})
      }
      setFieldEditable({editing: false})
    },
    getNextValue: props => () => {
      return props.fieldEditable.editing ? props.fieldEditable.nextValue : props.value
    },
  })
)

const FieldEditable = props => {
  let {handleInput, saveChanges, handleFocus} = props
  return (
    <Form className="field-editable-container">
      <TextArea
        autoHeight
        // contentEditable={true}
        onFocusCapture={handleFocus}
        onChange={handleInput}
        onBlurCapture={saveChanges}
        value={props.getNextValue()}
        className="field-editable"
      />
    </Form>
  )
}

export default fieldEditableContainer(FieldEditable)
