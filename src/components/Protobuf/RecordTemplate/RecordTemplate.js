import React, { useState } from 'react'
import withStyles from 'react-jss'
import { DescriptorSetProto } from '../index'

import classNames from 'classnames'

import { templateBuilder } from 'oip-protobufjs'
import WalletButton from '../../WalletButton/WalletButton'

const RecordTemplate = ({
  classes,
  onSuccess,
  onError,
  _extends
}) => {
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
        network,
        _extends
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

  function handleOnSuccess(res) {
    if (onSuccess) onSuccess(res)
  }
  function handleOnError(err) {
    if (onError) onError(err)
  }
  return <div className={classes.recordTemplateRoot}>
    <div className={classNames(classes.templateFieldRow, classes.nameRow)}>
      <span className={classes.inputTitle}>Friendly Name</span>
      <input
        type={'text'}
        value={name}
        className={classes.inputBase}
        onChange={(e) => setName(e.target.value)}
        placeholder={'Template name'}
      />
    </div>
    <div className={classNames(classes.templateFieldRow, classes.descriptionRow)}>
      <span className={classes.inputTitle}>Description</span>
      <input
        type={'text'}
        value={description}
        className={classes.inputBase}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={'Template description'}
      />
    </div>
    <DescriptorSetProto
      getDescriptor={getProtoDescriptor}
      classes={classes}
    />
    <div className={classNames(classes.templateFieldRow, classes.wifRow)}>
      <span className={classes.inputTitle}>private key (wif)</span>
      <input
        id={'wif'}
        type={'text'}
        onChange={handlePrivateKey}
        value={privateKey}
        className={classes.inputBase}
        placeholder={'Private key (wif)'}
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
      <div className={classes.walletButton}>
        <WalletButton
          text={'Create & Publish'}
          wif={privateKey}
          network={network}
          setMessage={getMessage}
          onSuccess={handleOnSuccess}
          onError={handleOnError}
        />
      </div>
    </div>
  </div>
}


const styles = theme => ({
  recordTemplateRoot: {
    width: 275,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  templateFieldRow: {
    position: 'relative'
  },
  selectBase: {
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: '3px',
    padding: [3, 2],
    width: '48%'
  },
  inputBase: {
    height: 25,
    boxSizing: 'border-box',
    margin: [15, 0, 13, 0],
    width: 250,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: '3px',
    padding: [3, 2],
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10,
    }
  },
  buttonBase: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    color: theme.palette.greyscale(0.3),
    fontWeight: 'bold'
  },
  inputTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 11,
    color: theme.palette.greyscale(0.7)
  },
  nameRow: {},
  descriptionRow: {},
  wifRow: {},
  publishRow: {
    width: '250px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  selectNetwork: {
    height: '25px',
    width: '120px'
  },
  publishButton: {},
  // descriptor specific
  descriptorRoot: {},
  descriptorFieldRowContainer: {},
  addRowButton: {
    border: 0,
    margin: [0, 0, 5, 0],
    '&:hover': {
      cursor: 'pointer',
    }
  },
  removeRowButton: {
    marginLeft: 7,
    border: 0,
    '&:hover': {
      cursor: 'pointer',
    }
  },
  descriptorInputField: {},
  descriptorSelect: {},
  selectOptions: {
    width: 250,
    display: 'flex',
    justifyContent: 'space-between'
  },
  //wallet button
  walletButton: {
    '& > button': {
      padding: [4, 8]
    }
  },
  // tags input
  tagsInputRoot: {
    width: 250,
    marginBottom: 13,
    boxSizing: 'border-box'
  }
})

export default withStyles(styles)(RecordTemplate)
