import React, { useMemo, useReducer } from 'react'
import withStyles from 'react-jss'
import PropTypes from 'prop-types'
import { decodeDescriptor } from 'oip-protobufjs'
import { TagsInput } from '../../UI'

const fieldHeight = 25
const fieldWidth = 250
const marginTopForTitle = 15

const styles = theme => ({
  root: {
    width: fieldWidth,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  inputField: {
    width: fieldWidth,
    height: fieldHeight,
    boxSizing: 'border-box',
    padding: 4,
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10,
    }
  },
  selectField: {
    width: fieldWidth,
    height: fieldHeight,
    boxSizing: 'border-box',
    padding: 4,
    background: 'none',
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    fontSize: 12
  },
  fieldContainer: {
    position: 'relative'
  },
  fieldTitle: {
    fontSize: 10,
    color: `${theme.palette.greyscale(0.8)}`,
    position: 'absolute'
  },
  // tags input
  tagsInputRoot: {
    width: fieldWidth,
    boxSizing: 'border-box',
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    height: fieldHeight
  },
  input: {
    width: fieldWidth,
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10,
    }
  }
})

const RecordProto = ({
  classes,
  descriptor,
  templateName
}) => {
  const memoizedDescriptor = useMemo(() => decodeDescriptor(descriptor, true), [descriptor])
  const { webFmt } = memoizedDescriptor

  let initialState = {}

  // function init (initialState) {
  //   let
  // }

  // function reducer (state, action) {
  //   if (action.type === 'UPDATE') {
  //       return {
  //         ...state,
  //         [action.field]: action.value
  //       }
  //   } else throw Error('Invalid type passed to reducer')
  // }
  //
  // const [state, dispatch] = useReducer(reducer, initialState, init)

  return <RecordInterface
    classes={classes}
    webFmt={webFmt}
  />
}

const RecordInterface = ({
  classes,
  webFmt
}) => {
  return <div className={classes.root}>
    {Object.keys(webFmt.fields).map((field, i) => {
      const fieldData = webFmt.fields[field]
      return <FieldRow
        key={i}
        field={field}
        fieldData={fieldData}
        classes={classes}
      />
    })}
    {Object.keys(webFmt.enums).map((enumField, i) => {
      const enumData = webFmt.enums[enumField]
      return <EnumRow
        i={i}
        enumField={enumField}
        enumData={enumData}
        classes={classes}
      />
    })}
  </div>
}

const EnumRow = ({
  enumField,
  enumData,
  i,
  classes
}) => {
  const { values, rule } = enumData
  return <div className={classes.fieldContainer} key={i}>
    <span className={classes.fieldTitle}>
      Field: {enumField}
    </span>
    <select
      value={0}
      onChange={() => {}}
      className={classes.selectField}
    >
      {Object.keys(values).map((value, i) => {
        return <option key={i} value={values[value]}>
          {value}
        </option>
      })}
    </select>
  </div>
}

const FieldRow = ({
  field,
  fieldData,
  i,
  classes
}) => {
  const { type, repeated } = fieldData
  return <div className={classes.fieldContainer} key={i}>
    <span className={classes.fieldTitle}>
      Field: {field} | Type: {type}
    </span>
    {repeated ? <TagsInput
      placeholder={`${field}`}
      getTags={(tags) => {

      }}
      allowSpaces={true}
      classes={classes}
    /> : <input
      className={classes.inputField}
      placeholder={field.toLowerCase()}
      type={type}
    />}
  </div>
}

RecordProto.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RecordProto)
