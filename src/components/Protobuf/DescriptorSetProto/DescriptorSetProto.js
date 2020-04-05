import React, { useRef, useState } from 'react'
import withStyles from 'react-jss'
import classNames from 'classnames'
import { buildDescriptor } from 'oip-protobufjs'
import uid from 'uid'

import FieldRow from './FieldRow'

// gfs = GLOBAl FORM STATE - duh!
import { useGlobalFormState } from '../../../hooks'
import styles from './styles'
import serializeFormData from './helpers/serializeFormData'
import { initialFormRow } from './constants'

const DescriptorSetProto = ({ classes, getDescriptor }) => {
  const [passErrorMessage, setPassErrorMessage] = useState('')

  const id = useRef(uid()).current

  const gfs = useGlobalFormState(id, initialFormRow)
  const fieldnameArr = serializeFormData(gfs.state.form).map(x => x.name).filter(el => el !== '')
  const filtered = fieldnameArr.filter((v, i, a) => a.indexOf(v) === i).filter(el => el !== '')

  const liftDescriptor = () => {
    if (getDescriptor) {
      let descriptor
      try {
        descriptor = buildDescriptor(serializeFormData(gfs.state.form))
      } catch (err) {
        console.error(`${err}: liftDescriptor - DescriptorSetProto`)
      }
      getDescriptor(descriptor)
    }
  }

  function errorMessage (message) {
    setPassErrorMessage(message)
  }

  const arraysMatch = function (arr1, arr2) {
    if (arr1.length !== arr2.length) { return errorMessage('Enter unique field names') }


    return errorMessage(null)
  }

  function validate () {
    arraysMatch(fieldnameArr, filtered)
  }

  return <div className={classes.descriptorRoot}>
    <FieldRow
      gfs={gfs}
      id={id}
      liftDescriptor={liftDescriptor}
      classes={classes}
      validate={validate}
    />
    {/* for every from created */}
    {Object.keys(gfs.state.form).map((formId) => {
      if (formId !== id) {
        return <FieldRow
          classes={classes}
          gfs={gfs}
          id={formId}
          key={formId}
          liftDescriptor={liftDescriptor}
          fieldnameArr={fieldnameArr}
          validate={validate}
        />
      }
    })}
    {/* add another row */}
    <div>{passErrorMessage}</div>
    <button
      className={classNames(classes.buttonBase, classes.addRowButton)}
      onClick={() => gfs.add(uid(), initialFormRow)}
    >+
    </button>
  </div>
}

export default withStyles(styles)(DescriptorSetProto)
