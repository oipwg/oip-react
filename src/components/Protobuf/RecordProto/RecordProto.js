import React, { useEffect, useMemo, useReducer, useState } from 'react'
import withStyles from 'react-jss'
import PropTypes from 'prop-types'
import { decodeDescriptor } from 'oip-protobufjs'

import { TagsInput } from '../../UI'
import WalletButton from '../../WalletButton/WalletButton'
import { recordProtoBuilder } from 'oip-protobufjs/src'

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
  publishContainer: {
    width: fieldWidth
  },
  fieldContainer: {
    position: 'relative'
  },
  fieldTitle: {
    fontSize: 10,
    color: `${theme.palette.greyscale(0.8)}`,
    position: 'absolute'
  },
  publishRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  networkSelect: {
    height: fieldHeight,
    boxSizing: 'border-box',
    padding: 4,
    background: 'none',
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    fontSize: 12,
    width: 123
  },
  walletButton: {
    '& > button': {
      padding: [4, 8]
    }
  },
  // tags input
  tagsInputRoot: {
    width: fieldWidth,
    boxSizing: 'border-box',
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    height: fieldHeight,
    position: 'relative',
    '& > input': {
      width: fieldWidth,
      position: 'relative',
      boxSizing: 'border-box'
    }
  },
  input: {
    width: fieldWidth,
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10,
    },
    boxSizing: 'border-box'
  }
})

const RecordProto = ({
  classes,
  descriptor,
  templateName,
  onSuccess,
  onError,
  mainnetExplorerUrl = 'https://livenet.flocha.in/api',
  testnetExplorerUrl = 'https://testnet.explorer.mediciland.com/api'
}) => {
  const memoizedDescriptor = useMemo(() => decodeDescriptor(descriptor, true), [descriptor])
  const { webFmt } = memoizedDescriptor

  let initialState = {}

  function reducer (state, action) {
    if (action.type === 'UPDATE') {
      return {
        ...state,
        [action.field]: action.value
      }
    } else throw Error('Invalid type passed to reducer')
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  function prefixMessage (message) {
    return `p64:${message}`
  }

  function serializeState(state) {
    return {
      name: templateName,
      descriptor: descriptor,
      payload: state
    }
  }

  function getMessage ({wif, network}) {
    // build record template
    const serializedDetailsData = serializeState(state)
    let signedMessage
    try {
      signedMessage = recordProtoBuilder({
        detailsData: serializedDetailsData,
        wif,
        network
      })
    } catch (err) {
      throw Error(err)
    }
    return prefixMessage(signedMessage.signedMessage64)
  }

  // useEffect(() => {
  //   getMessage()
  // }, [state])

  return <RecordInterface
    classes={classes}
    webFmt={webFmt}
    dispatch={dispatch}
    onSuccess={onSuccess}
    onError={onError}
    getMessage={getMessage}
    mainnetExplorerUrl={mainnetExplorerUrl}
    testnetExplorerUrl={testnetExplorerUrl}
  />
}

const RecordInterface = ({
  classes,
  webFmt,
  dispatch,
  onSuccess,
  onError,
  getMessage,
  mainnetExplorerUrl,
  testnetExplorerUrl
}) => {
  return <div className={classes.root}>
    {Object.keys(webFmt.fields).map((field, i) => {
      const fieldData = webFmt.fields[field]
      return <FieldRow
        key={i}
        field={field}
        fieldData={fieldData}
        classes={classes}
        dispatch={dispatch}
      />
    })}
    {Object.keys(webFmt.enums).map((enumField, i) => {
      const enumData = webFmt.enums[enumField]
      return <EnumRow
        i={i}
        enumField={enumField}
        enumData={enumData}
        classes={classes}
        dispatch={dispatch}
      />
    })}
    <Publisher
      classes={classes}
      onSuccess={onSuccess}
      onError={onError}
      getMessage={getMessage}
      mainnetExplorerUrl={mainnetExplorerUrl}
      testnetExplorerUrl={testnetExplorerUrl}
    />
  </div>
}

const EnumRow = ({
  enumField,
  enumData,
  i,
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

  const { values } = enumData // currently don't allow repeated
  return <div className={classes.fieldContainer} key={i}>
    <span className={classes.fieldTitle}>
      Field: {enumField}
    </span>
    <select
      value={state}
      onChange={handleSelectChange}
      className={classes.selectField}
    >
      {Object.keys(values).map((value, i) => {
        return <option key={i} value={values[value]}>
          {formatEnumValue(value)}
        </option>
      })}
    </select>
  </div>
}

const FieldRow = ({
  field,
  fieldData,
  i,
  classes,
  dispatch
}) => {
  const [state, setState] = useState('')

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
  }, [state])

  const { type, repeated } = fieldData
  return <div className={classes.fieldContainer} key={i}>
    <span className={classes.fieldTitle}>
      Field: {field} | Type: {repeated ? `Repeated` : null} {type}
    </span>
    {repeated ? <TagsInput
      placeholder={`${field}`}
      getTags={(tags) => {
        handleInputChange(tags, true)
      }}
      allowSpaces={true}
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

const Publisher = ({
  classes,
  getMessage,
  onSuccess,
  onError,
  mainnetExplorerUrl,
  testnetExplorerUrl
}) => {
  const [wif, setWif] = useState('')
  const [network, setNetwork] = useState('mainnet')

  function handlePrivateKey(e) {
    setWif(e.target.value)
  }

  function handleNetworkChange (e) {
    setNetwork(e.target.value)
  }

  function _getMessage() {
    return getMessage({wif, network})
  }

  return <div className={classes.publishContainer}>
    <div className={classes.fieldContainer}>
      <span className={classes.fieldTitle}>Private key (wif)</span>
      <input
        id={'wif'}
        type={'text'}
        onChange={handlePrivateKey}
        value={wif}
        className={classes.inputField}
        placeholder={'private key (wallet import format)'}
      />
    </div>
    <div className={classes.publishRow}>
      <select
        value={network}
        onChange={handleNetworkChange}
        className={classes.networkSelect}>
        <option value={'mainnet'}>
          mainnet
        </option>
        <option value={'testnet'}>
          testnet
        </option>
      </select>
      <div className={classes.walletButton}>
        <WalletButton
          text={'Create & Publish'}
          wif={wif}
          network={network}
          getMessage={_getMessage}
          onSuccess={onSuccess}
          onError={onError}
          mainnetExplorerUrl={mainnetExplorerUrl}
          testnetExplorerUrl={testnetExplorerUrl}
        />
      </div>
    </div>
  </div>
}

function formatEnumValue (value) {
  value = value.split('_')
  if (value[1]) {
    value = value[1].toLowerCase()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  return value[0].toLowerCase()
}

RecordProto.propTypes = {
  classes: PropTypes.object.isRequired,
  descriptor: PropTypes.string.isRequired,
  templateName: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
}

export default withStyles(styles)(RecordProto)
