import React, { useEffect, useState } from 'react'
import { TagsInput } from '../../../UI'

/** * FIELD INPUTS***/
const FieldRow = ({
  field,
  fieldData,
  classes,
  dispatch
}) => {
  const [state, setState] = useState('')
  const { type, repeated } = fieldData

  function handleInputChange (e, tags = false) {
    if (tags) {
      setState(e)
    } else {
      setState(e.target.value)
    }
  }

  useEffect(() => {
    dispatch({
      type: 'UPDATE',
      value: state,
      field: field
    })
  }, [state, field])

  return <div className={classes.fieldContainer}>
    <span className={classes.fieldTitle}>
      Field: {field} | Type: {repeated ? 'Repeated' : null} {type}
    </span>

    {repeated ? <TagsInput
      placeholder={`${field}`}
      getTags={(tags) => {
        handleInputChange(tags, true)
      }}
      allowSpaces
      classes={classes}
    /> : <input
      className={classes.inputField}
      placeholder={field.toLowerCase()}
      type={type}
      value={state}
      onChange={handleInputChange}
    />}
  </div>
}

export default FieldRow
