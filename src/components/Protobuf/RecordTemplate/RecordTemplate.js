import React, { useState, useRef } from 'react'
import withStyles from 'react-jss'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { templateBuilder } from 'oip-protobufjs'
import { Publisher } from '../../Publisher'
import { DescriptorSetProto } from '../index'
import styles from './styles'

const RecordTemplate = ({
  classes,
  onSuccess,
  onError,
  _extends,
  mainnetExplorerUrl = 'https://livenet.flocha.in/api',
  testnetExplorerUrl = 'https://testnet.explorer.mediciland.com/api',
  withPublisher = false,
  feedback,
  wif,
  hidePrivateKeyInput = false
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const descriptorRef = useRef(null)

  function getSignedTemplateMessage ({ wif, network }) {
    let template

    try {
      template = templateBuilder({
        friendlyName: name,
        DescriptorSetProto: descriptorRef.current,
        wif,
        description,
        network,
        _extends
      })
    } catch (err) {
      throw Error(`Failed to build proto template at getSignedTemplateMessage in RecordTemplate.js: \n ${err}`)
    }
    const { signedMessage64 } = template

    return signedMessage64
  }

  function prefixMessage (message) {
    const prefix = 'p64:'
    return `${prefix}${message}`
  }

  function getMessage ({ wif, network }) {
    let signedMessage
    try {
      signedMessage = getSignedTemplateMessage({ wif, network })
    } catch (err) {
      throw Error(`Failed to getSignedTemplateMessage at getMessage() in RecordTemplate.js: \n ${err}`)
    }
    return (prefixMessage(signedMessage))
  }

  const getProtoDescriptor = (descriptor) => {
    descriptorRef.current = descriptor
  }

  return <div className={classes.recordTemplateRoot}>
    <div className={classNames(classes.templateFieldRow, classes.nameRow)}>
      <span className={classes.inputTitle}>Friendly Name</span>
      <input
        type='text'
        value={name}
        className={classes.inputBase}
        onChange={(e) => setName(e.target.value)}
        placeholder='Template name'
      />
    </div>
    <div className={classNames(classes.templateFieldRow, classes.descriptionRow)}>
      <span className={classes.inputTitle}>Description</span>
      <input
        type='text'
        value={description}
        className={classes.inputBase}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Template description'
      />
    </div>
    <DescriptorSetProto
      getDescriptor={getProtoDescriptor}
      classes={classes}
    />
    {withPublisher && <Publisher
      classes={classes}
      onSuccess={onSuccess}
      onError={onError}
      getMessage={getMessage}
      mainnetExplorerUrl={mainnetExplorerUrl}
      testnetExplorerUrl={testnetExplorerUrl}
      feedback={feedback}
      wif={wif}
      hidePrivateKeyInput={hidePrivateKeyInput}
    />}
  </div>
}

RecordTemplate.propTypes = {
  classes: PropTypes.object.isRequired,
  _extends: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  withPublisher: PropTypes.bool,
  mainnetExplorerUrl: PropTypes.string,
  testnetExplorerUrl: PropTypes.string,
  hidePrivateKeyInput: PropTypes.bool,
  wif: PropTypes.string
}

export default withStyles(styles)(RecordTemplate)
