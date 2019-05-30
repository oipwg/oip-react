import React, { useEffect, useMemo, useReducer, useState, useRef } from 'react'
import withStyles from 'react-jss'
import PropTypes from 'prop-types'
import { decodeDescriptor, recordProtoBuilder, buildOipDetails } from 'oip-protobufjs'
import { DaemonApi } from 'js-oip'

import { TagsInput } from '../../UI'
import Publisher from '../../Publisher/Publisher/Publisher'

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
  template,
  onSuccess,
  onError,
  mainnetExplorerUrl = 'https://livenet.flocha.in/api',
  testnetExplorerUrl = 'https://testnet.explorer.mediciland.com/api',
  oipdHttpApi = 'http://localhost:1606/oip', // toDo: switch to a production endpoint
  withPublisher = false,
  getOipDetailsData,
  keyIndex,
}) => {
  let { file_descriptor_set: descriptor, name: templateName, extends: _extends } = template
  const memoizedDescriptor = useMemo(() => decodeDescriptor(descriptor, true), [descriptor])
  const { webFmt } = memoizedDescriptor

  // handle extended templates
  const [extendedTemplates, setExtendedTemplates] = useState({})
  const daemonRef = useRef(null)

  function getDaemonApi () {
    if (daemonRef.current === null) {
      daemonRef.current = new DaemonApi(oipdHttpApi)
    }
    return daemonRef.current
  }

  useEffect(() => {
    if (_extends) {
      if (!Array.isArray(_extends)) {
        _extends = [_extends]
      }
      const searchTemplates = async (templatesIds) => {
        let daemonApi = getDaemonApi()
        for (let id of templatesIds) {
          if (!extendedTemplates[id]) {
            const searchQuery = `template.identifier:${id}`
            let res
            try {
              res = await daemonApi.searchOip5Templates({ q: searchQuery })
            } catch (err) {
              throw Error(`Failed to search for templates matching identifier: ${id} \n ${err}`)
            }
            const { success, payload } = res
            if (success) {
              let payloadResults = payload.results // SHOULD ALWAYS BE AN ARRAY
              if (payloadResults[0]) {
                const { template } = payloadResults[0]
                if (template) {
                  setExtendedTemplates(prevState => {
                    return {
                      ...prevState,
                      [id]: template
                    }
                  })
                }
              }
            } else {
              console.error(`response success returns false when searching templates for identifier: ${id}`)
            }
          }
        }
      }
      searchTemplates(_extends)
    }
  }, [_extends])
  // ^^ handling extended templates

  // handle individual record proto state
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
  // ^^ handling individual record proto state

  // serialize
  function prefixMessage (message) {
    return `p64:${message}`
  }

  function serializeState (state) {
    return {
      name: templateName,
      descriptor: descriptor,
      payload: state
    }
  }
  // ^^ handling serialization

  // handle build and lift state
  function liftOipDetailsData () {
    let details
    try {
      details = buildOipDetails(serializeState(state))
    } catch (err) {
      throw Error(`Failed to build OipDetails in RecordProto: \n ${err}`)
    }
    return details
  }

  useEffect(() => {
    if (getOipDetailsData) {
      try {
        return liftOipDetailsData()
      } catch (err) {
        throw Error(`Failed to lift Oip Details in useEffect in RecordProto: \n ${err}`)
      }
    }
  }, [state])
  // ^^ handling build and lift state

  // function passed to Publisher to build and create message (only useful if publisher is set to true)
  function getMessage ({ wif, network }) {
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
      throw Error(`Failed to get message in RecordProto: \n ${err}`)
    }
    return prefixMessage(signedMessage.signedMessage64)
  }

  return <RecordInterface
    classes={classes}
    webFmt={webFmt}
    dispatch={dispatch}
    onSuccess={onSuccess}
    onError={onError}
    getMessage={getMessage}
    mainnetExplorerUrl={mainnetExplorerUrl}
    testnetExplorerUrl={testnetExplorerUrl}
    withPublisher={withPublisher}
    keyIndex={keyIndex}
    extendedTemplates={extendedTemplates}
    oipdHttpApi={oipdHttpApi}
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
  testnetExplorerUrl,
  withPublisher,
  keyIndex,
  extendedTemplates,
  oipdHttpApi,
}) => {
  return <div className={classes.root} key={keyIndex}>
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
    {Object.keys(extendedTemplates).map((templateIdentifier, i) => {
      const template = extendedTemplates[templateIdentifier]
      return <RecordProto
        classes={classes}
        keyIndex={i}
        mainnetExplorerUrl={mainnetExplorerUrl}
        testnetExplorerUrl={testnetExplorerUrl}
        oipdHttpApi={oipdHttpApi}
        template={template}
      />
    })}
    {withPublisher && <Publisher
      classes={classes}
      onSuccess={onSuccess}
      onError={onError}
      getMessage={getMessage}
      mainnetExplorerUrl={mainnetExplorerUrl}
      testnetExplorerUrl={testnetExplorerUrl}
    />}
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
  template: PropTypes.shape({
    descriptor: PropTypes.string.isRequired,
    templateName: PropTypes.string.isRequired,
    _extends: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ])
  }),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  withPublisher: PropTypes.bool,
  mainnetExplorerUrl: PropTypes.string,
  testnetExplorerUrl: PropTypes.string,
  getOipDetailsData: PropTypes.func
}

export default withStyles(styles)(RecordProto)
