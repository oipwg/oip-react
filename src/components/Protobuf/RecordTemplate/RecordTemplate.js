import React, { useEffect, useState } from 'react'
import withStyles from 'react-jss'

import styles from './styles'
import { DescriptorSetProto } from '../index'
import { templatebuilder } from './dependencies'
import { isValidWIF } from '../../../util'

const RecordTemplate = ({ classes }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [disableSubmit, toggleDisable] = useState(true)
  const [descriptor, setProtoDescriptor] = useState(undefined)
  
  useEffect(() => {
    toggleDisable(!isValidWIF(privateKey, 'testnet'))
  }, [privateKey])
  
  const handlePrivateKey = (e) => {
    setPrivateKey(e.target.value)
  }
  
  const handlePublish = async () => {
    let template
    try {
      template = templatebuilder({
        friendlyName: name,
        DescriptorSetProto: descriptor,
        wif: privateKey,
        description,
        network: 'testnet'
      })
    } catch (err) {
      throw Error(err)
    }
    
    if (template) {
      const prefix = 'p64:'
      const message = `${prefix}:${template}`
      
      try {
        // let res = await new OIP(...).sendToChain(message)
      } catch (err) {
        throw new Error(`failed to send template message to chain: ${err}`)
      }
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
    <button
      disabled={disableSubmit}
      onClick={handlePublish}
    >Create & Publish
    </button>
  </div>
}

export default withStyles(styles)(RecordTemplate)
