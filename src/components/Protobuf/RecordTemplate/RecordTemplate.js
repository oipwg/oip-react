import React, { useEffect, useState } from 'react'
import withStyles from 'react-jss'
import { OIP } from 'js-oip'
import { DescriptorSetProto } from '../index'
import { isValidWIF } from '../../../util'
import classNames from 'classnames'

import { templateBuilder } from 'oip-protobufjs'
import WalletButton from '../../WalletButton/WalletButton'

const RecordTemplate = ({ classes, getPubResponse }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [descriptor, setProtoDescriptor] = useState(undefined)
  const [network, changeNetwork] = useState('mainnet')

  const handlePrivateKey = (e) => {
    setPrivateKey(e.target.value)
  }

  const handleNetworkChange = (e) => {
    changeNetwork(e.target.value)
  }

  function getSignedTemplateMessage () {
    let template
    try {
      template = templateBuilder({
        friendlyName: name,
        DescriptorSetProto: descriptor,
        wif: privateKey,
        description,
        network
      })
    } catch (err) {
      throw Error(err)
    }
    const { signedMessage64 } = template

    return signedMessage64
  }

  function serializeMessage (message) {
    const prefix = 'p64:'
    return `${prefix}${message}`
  }

  function getMessage() {
    return serializeMessage(getSignedTemplateMessage())
  }

  const getProtoDescriptor = (descriptor) => {
    setProtoDescriptor(descriptor)
  }

  function onSuccess(res) {
    console.log('success', res)
  }
  function onError(err) {
    console.error(err)
  }
  return <div className={classes.recordTemplateRoot}>
    <div className={classNames(classes.templateFieldRow, classes.nameRow)}>
      <span className={classes.inputTitle}>Friendly Name</span>
      <input
        type={'text'}
        value={name}
        className={classes.inputBase}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className={classNames(classes.templateFieldRow, classes.descriptionRow)}>
      <span className={classes.inputTitle}>Description</span>
      <input
        type={'text'}
        value={description}
        className={classes.inputBase}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
    <DescriptorSetProto
      getDescriptor={getProtoDescriptor}
      classes={classes}
    />
    <div className={classNames(classes.templateFieldRow, classes.wifRow)}>
      <span className={classes.inputTitle}>Input private key (WIF)</span>
      <input
        type={'text'}
        onChange={handlePrivateKey}
        value={privateKey}
        className={classes.inputBase}
      />
    </div>
    <div className={classNames(classes.templateFieldRow, classes.publishRow)}>
      <select
        value={network}
        onChange={handleNetworkChange}
        className={classNames(classes.selectBase, classes.selectNetwork)}>
        <option value={'mainnet'}>
          mainnet
        </option>
        <option value={'testnet'}>
          testnet
        </option>
      </select>
      <WalletButton
        text={'Create & Publish'}
        wif={privateKey}
        network={network}
        setMessage={getMessage}
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  </div>

}

const styles = theme => ({
  recordTemplateRoot: {},
  selectBase: {},
  inputBase: {},
  buttonBase: {},
  templateFieldRow: {},
  inputTitle: {},
  nameRow: {},
  descriptionRow: {},
  wifRow: {},
  publishRow: {},
  selectNetwork: {},
  publishButton: {}
})

export default withStyles(styles)(RecordTemplate)
