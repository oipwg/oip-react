import React, { useEffect, useState } from 'react'
import withStyles from 'react-jss'
import { OIP } from 'js-oip'
import { DescriptorSetProto } from '../index'
import { isValidWIF } from '../../../util'
import classNames from 'classnames'

import { templateBuilder } from 'oip-protobufjs'

const RecordTemplate = ({ classes, getPubResponse }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [disableSubmit, toggleDisable] = useState(true)
  const [descriptor, setProtoDescriptor] = useState(undefined)
  const [network, changeNetwork] = useState('mainnet')

  useEffect(() => {
    toggleDisable(!isValidWIF(privateKey, network))
  }, [privateKey, network])

  const handlePrivateKey = (e) => {
    setPrivateKey(e.target.value)
  }

  const handleNetworkChange = (e) => {
    changeNetwork(e.target.value)
  }

  const handlePublish = async () => {
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
    if (signedMessage64) {
      const prefix = 'p64:'
      const message = `${prefix}${signedMessage64}`
      console.log(message)

      // const explorerUrl = network === 'mainnet' ? 'https://flocha.in/api' : 'https://testnet.explorer.mediciland.com/api'
      //
      // const oip = new OIP(privateKey, 'testnet', { explorerUrl }) // toDo: switch to flochain
      // const wallet = oip.wallet
      //
      // let res
      // try {
      //   res = await wallet.sendDataToChain(message)
      // } catch (err) {
      //   if (getPubResponse) {
      //     getPubResponse(err)
      //   }
      //   alert(`failed to send template message to chain: ${err}`)
      //   // throw new Error(`failed to send template message to chain: ${err}`)
      // }
      // if (getPubResponse) {
      //   getPubResponse(res)
      // }
      // alert(`Publish success/TXID: ${res}`)
    }
  }

  const getProtoDescriptor = (descriptor) => {
    setProtoDescriptor(descriptor)
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
      <button
        className={classNames(classes.buttonBase, classes.publishButton)}
        disabled={disableSubmit}
        onClick={handlePublish}
      >Create & Publish
      </button>
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
