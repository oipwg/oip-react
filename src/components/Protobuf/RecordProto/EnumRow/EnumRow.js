import React, { useEffect, useState } from 'react'

// removes _ from enum values
function formatEnumValue (value) {
  value = value.split('_')
  if (value[1]) {
    value = value[1].toLowerCase()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  return value[0].toLowerCase()
}

//* ** Enum Dropdown ***/
const EnumRow = ({
  enumField,
  enumData,
  classes,
  dispatch
}) => {
  const [state, setState] = useState(0)

  function handleSelectChange (e) {
    setState(Number(e.target.value))
  }

  useEffect(() => {
    dispatch({
      type: 'UPDATE',
      value: state,
      field: enumField
    })
  }, [state])

  let values // currently don't allow repeated
  if (enumData && enumData.values) {
    values = enumData.values
  }

  // creates enum field dropdown
  return (
    <div className={classes.fieldContainer}>
      <span className={classes.fieldTitle}>
        Field: {enumField}
      </span>
      <select
        value={state}
        onChange={handleSelectChange}
        className={classes.selectField}
      >
        {values && Object.keys(values).map((value, i) => {
          return (
            <option key={`${value}-${i}`} value={values[value]}>
              {formatEnumValue(value)}
            </option>
          )
        })}

      </select>
    </div>

  )
}

export default EnumRow
