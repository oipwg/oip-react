import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from 'react'
import withStyles from 'react-jss'
import PropTypes from 'prop-types'
import { decodeDescriptor, recordProtoBuilder } from 'oip-protobufjs'
import { DaemonApi } from 'js-oip'

import styles from './styles'
import RecordInterface from './RecordInterface'

// handle individual record proto state
const initialState = {}

function reducer (state, action) {
  if (action.type === 'UPDATE') {
    return {
      ...state,
      [action.field]: action.value
    }
  } else throw Error('Invalid type passed to reducer - RecordProto')
}

const RecordProto = ({
  classes,
  template,
  onSuccess,
  onError,
  mainnetExplorerUrl = 'https://livenet.flocha.in/api',
  testnetExplorerUrl = 'https://testnet.explorer.mediciland.com/api',
  oipdHttpApi = 'https://api.oip.io/oip',
  withPublisher = false,
  keyIndex, // internal use
  getOipDetails, // external use
  rootKey, // internal use
  __liftDetails // internal use,
}) => {
  // define top-level record proto
  const root = rootKey || 'ROOT'

  // deserialize template data
  let { file_descriptor_set: descriptor, name: templateName, extends: _extends } = template
  const memoizedDescriptor = useMemo(() => decodeDescriptor(descriptor, true), [descriptor])

  const { webFmt } = memoizedDescriptor

  // handle extended templates
  const [extendedTemplates, setExtendedTemplates] = useState({})

  const daemonRef = useRef(null)

  // fetches extended templates
  useEffect(() => {
    if (_extends) {
      if (!Array.isArray(_extends)) {
        _extends = [_extends]
      }

      const getDaemonApi = () => {
        if (daemonRef.current === null) {
          daemonRef.current = new DaemonApi(oipdHttpApi)
        }
        return daemonRef.current
      }

      const searchTemplates = async (templatesIds) => {
        const daemonApi = getDaemonApi()
        for (const id of templatesIds) {
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
              const payloadResults = payload.results // SHOULD ALWAYS BE AN ARRAY
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

  // handles individual record proto state
  const [state, dispatch] = useReducer(reducer, initialState)

  // handle state updating and lifting
  /**
   * @typedef detailsData
   * @example
   * {
   *   [root]: serializedState(state),
   *   [root1]: serializedState(state)
   * }
   */
  const [detailsData, setDetailsData] = useState({})

  // handle state updates, set it to total details data state (internal)
  useEffect(() => {
    setDetailsData(prevState => {
      return {
        ...prevState,
        [root]: serializeState(state)
      }
    })
  }, [state])

  // lift details up to parent
  useEffect(() => {
    if (__liftDetails) {
      __liftDetails(detailsData)
    }
    if (getOipDetails) {
      const keys = Object.keys(detailsData)
      const details = []
      for (const key of keys) {
        details.push(detailsData[key])
      }
      getOipDetails(details) // array of detail Any payloads
    }
  }, [detailsData, __liftDetails, getOipDetails])
  // ^^ handling build and lift state

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

  const setChildState = useCallback((detailsData) => {
    setDetailsData(prevState => {
      return {
        ...prevState,
        ...detailsData
      }
    })
  }, [])

  // function passed to Publisher to build and create message (only useful if publisher is set to true)
  function getMessage ({ wif, network }) {
    // build record template
    const keys = Object.keys(detailsData)
    const anyPayloads = []
    for (const key of keys) {
      anyPayloads.push(detailsData[key])
    }

    let signedMessage
    try {
      signedMessage = recordProtoBuilder({
        detailsData: anyPayloads,
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
    root={root}
    setChildState={setChildState}
  />
}

RecordProto.propTypes = {
  classes: PropTypes.object.isRequired,
  template: PropTypes.shape({
    file_descriptor_set: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    extends: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ]),
    description: PropTypes.string,
    identifier: PropTypes.number,
    friendly_name: PropTypes.string
  }),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  withPublisher: PropTypes.bool,
  mainnetExplorerUrl: PropTypes.string,
  testnetExplorerUrl: PropTypes.string,
  getOipDetailsData: PropTypes.func,
  oipdHttpApi: PropTypes.string
}

export default withStyles(styles)(RecordProto)
