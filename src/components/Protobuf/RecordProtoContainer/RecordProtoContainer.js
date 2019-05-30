import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import { RecordProto } from '../index'
import { Publisher } from '../../Publisher'
import { buildOipDetails, recordProtoBuilder } from 'oip-protobufjs/src'

/**
 * @typedef {Object} templateData
 * @param {string} templateData.descriptor
 * @param {string} templateData.templateName
 * @param {string} [templateData.extends]
 */

/**
 *
 * @param {templateData|Array.<templateData>} recordData
 */
function RecordProtoContainer ({
  templateData,
  onSuccess,
  onError,
  mainnetExplorerUrl,
  testnetExplorerUrl
}) {
  if (!Array.isArray(templateData)) {
    templateData = [templateData]
  }

  const initState = {}
  function reducer (state, action) {
    if (action.type === 'UPDATE') {
      return {
        ...state,
        [action.name]: action.details
      }
    } else {
      throw Error(`Invalid action type in recordProtoContainer`)
    }
  }
  const [state, dispatch] = useReducer(reducer, initState)

  function storeDetailsData ({ detailsData, name }) {
    dispatch({
      type: 'UPDATE',
      name,
      details: detailsData
    })
  }

  function buildDetails () {
    let templates = Object.keys(state)
    let details = []
    for (let template of templates) {
      try {
        details.push(buildOipDetails(state[template]))
      } catch (err) {
        throw Error(`Failed to build oip details for ${template} in RecordProtoContainer: \n ${err}`)
      }
    }
    return details
  }

  function prefixMessage(message) {
    return `p64:${message}`
  }
  function getMessage ({wif, network}) {
    // build details
    let details
    try {
      details = buildDetails()
    } catch (err) {
      throw Error(`Failed to buildDetails at getMessage in recordProtoContainer: \n ${err}`)
    }
    // build record proto
    let recordData
    try {
      recordData = recordProtoBuilder({
        wif,
        network,
        details
      })
    } catch (err) {
      throw Error(`Failed to build record at getMessage in recordProtoContainer: \n ${err}`)
    }
    return prefixMessage(recordData.signedMessage64)
  }

  return <>
    {templateData.map((template, i ) => {
      return <RecordProto
        template={template}
        keyIndex={i}
        getOipDetailsData={(detailsData) => storeDetailsData({ detailsData, name: template.templateName })}
      />
    })}
  <Publisher
    getMessage={getMessage}
    mainnetExplorerUrl={mainnetExplorerUrl}
    testnetExplorerUrl={testnetExplorerUrl}
    onSuccess={onSuccess}
    onError={onError}
  />
  </>
}

RecordProtoContainer.propTypes = {}

export default RecordProtoContainer