import React, { useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { RecordProto } from '../index'
import { Publisher } from '../../Publisher'
import { recordProtoBuilder } from 'oip-protobufjs'

/**
 * @typedef {Object} templateData
 * @param {string} templateData.file_descriptor_set
 * @param {string} templateData.name
 * @param {string|Array.<string>} [templateData.extends]
 */

/**
 *
 * @param {templateData|Array.<templateData>} recordData
 */
function RecordProtoContainer ({
  classes,
  templates,
  onSuccess,
  onError,
  mainnetExplorerUrl,
  testnetExplorerUrl,
  oipdHttpApi = 'https://api.oip.io/oip'
}) {
  if (!Array.isArray(templates)) {
    templates = [templates]
  }

  const initState = {}

  // Reducers
  const [state, dispatch] = useReducer(reducer, initState)

  function reducer (state, action) {
    if (action.type === 'UPDATE') {
      return {
        ...state,
        [action.data.name]: {
          ...action.data
        }
      }
    } else {
      throw Error('Invalid action type in recordProtoContainer')
    }
  }

  const storeDetailsData = useCallback( (detailsData) => {
    if (detailsData.length === 0) return

    for (const data of detailsData) {
      const payload = {
        type: 'UPDATE',
        data
      }
      dispatch(payload)
    }
  }, [])

  function prefixMessage (message) {
    return `p64:${message}`
  }

  function getMessage ({ wif, network }) {
    const detailsData = []

    for (const tmpl in state) {
      if (state.hasOwnProperty(tmpl)) {
        detailsData.push(state[tmpl])
      }
    }

    // build record proto
    let recordData

    try {
      recordData = recordProtoBuilder({
        wif,
        network,
        detailsData
      })
    } catch (err) {
      throw Error(`Failed to build record at getMessage in recordProtoContainer: \n ${err}`)
    }
    return prefixMessage(recordData.signedMessage64)
  }

  // Protobuf Decoder => Template. Creates a Template.
  return <div className={classes.rpcRoot}>
    {templates.map((template, i) => {
      return <RecordProto
        key={`${template.identifier}-${i}`}
        classes={classes}
        template={template}
        getOipDetails={storeDetailsData}
        oipdHttpApi={oipdHttpApi}
      />
    })}
    <Publisher
      classes={classes}
      getMessage={getMessage}
      mainnetExplorerUrl={mainnetExplorerUrl}
      testnetExplorerUrl={testnetExplorerUrl}
      onSuccess={onSuccess}
      onError={onError}
    />
  </div>
}

const styles = theme => ({
  rpcRoot: {}
})

RecordProtoContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  templates: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.arrayOf(PropTypes.object).isRequired
  ]),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  mainnetExplorerUrl: PropTypes.string,
  testnetExplorerUrl: PropTypes.string,
  oipdHttpApi: PropTypes.string
}

export default withStyles(styles)(RecordProtoContainer)
