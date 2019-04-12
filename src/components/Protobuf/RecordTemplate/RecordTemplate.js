import React, { useEffect, useState } from 'react'
import withStyles from 'react-jss'
import { OIP } from 'js-oip'
import styles from './styles'
import { DescriptorSetProto } from '../index'
import { templateBuilder } from './dependencies'
import { isValidWIF } from '../../../util'

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

      const oip = new OIP(privateKey, 'testnet', { explorerUrl: 'https://testnet.explorer.mediciland.com/api' }) // toDo: switch to flochain
      const wallet = oip.wallet

      let res
      try {
        res = await wallet.sendDataToChain(message)
      } catch (err) {
        if (getPubResponse) {
          getPubResponse(err)
        }
        alert(`failed to send template message to chain: ${err}`)
        // throw new Error(`failed to send template message to chain: ${err}`)
      }
      if (getPubResponse) {
        getPubResponse(res)
      }
      alert(`Publish success/TXID: ${res}`)
    }
  }

  const getProtoDescriptor = (descriptor) => {
    setProtoDescriptor(descriptor)
  }

  return <div className={classes.root}>
    <div>
      <span>Friendly Name</span>
      <input
        type={'text'}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div>
      <span>Description</span>
      <input
        type={'text'}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
    <DescriptorSetProto
      getDescriptor={getProtoDescriptor}
    />
    <div>
      <span>Input private key (WIF)</span>
      <input
        type={'text'}
        onChange={handlePrivateKey}
        value={privateKey}
      />
    </div>
    <div className={classes.publishRow}>
      <select value={network} onChange={handleNetworkChange} className={classes.networkSelect}>
        <option value={'mainnet'}>
          mainnet
        </option>
        <option value={'testnet'}>
          testnet
        </option>
      </select>
      <button
        disabled={disableSubmit}
        onClick={handlePublish}
      >Create & Publish
      </button>
    </div>
    
  </div>
}

export default withStyles(styles)(RecordTemplate)
