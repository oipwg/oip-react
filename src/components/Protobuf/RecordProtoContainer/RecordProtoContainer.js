import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { RecordProto } from '../index'
import { Publisher } from '../../Publisher'
import { recordProtoBuilder } from 'oip-protobufjs/src'

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
  oipdHttpApi = 'http://localhost:1606/oip', // toDo: switch to a production endpoint
}) {
  if (!Array.isArray(templates)) {
    templates = [templates]
  }

  const initState = {}

  function reducer (state, action) {
    if (action.type === 'UPDATE') {
      return {
        ...state,
        [action.id]: action.details
      }
    } else {
      throw Error(`Invalid action type in recordProtoContainer`)
    }
  }

  const [state, dispatch] = useReducer(reducer, initState)

  function storeDetailsData ({ detailsData, id }) {
    dispatch({
      type: 'UPDATE',
      id,
      details: detailsData
    })
  }

  function prefixMessage (message) {
    return `p64:${message}`
  }

  function getMessage ({ wif, network }) {
    let detailsData = []
    console.log(state)

    for (let id in state) {
      if (state.hasOwnProperty(id)) {
        detailsData = [...detailsData, ...state[id]]
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

  return <>
    {templates.map((template, i) => {
      return <RecordProto
        classes={classes}
        template={template}
        keyIndex={i}
        getOipDetails={storeDetailsData}
        id={parseInt(`${Math.random().toFixed(7)*1e7}`)} // generate random number
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
  </>
}

const styles = theme => ({
  root: {}
})

RecordProtoContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({
    descriptor: PropTypes.string.isRequired,
    templateName: PropTypes.string.isRequired,
    _extends: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
  })),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  mainnetExplorerUrl: PropTypes.string,
  testnetExplorerUrl: PropTypes.string,
  oipdHttpApi: PropTypes.string
}

export default withStyles(styles)(RecordProtoContainer)