import React, { useState, useRef } from 'react'
import withStyles from 'react-jss'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { templateBuilder } from 'oip-protobufjs'
import { Publisher } from '../../Publisher'
import { DescriptorSetProto } from '../index'

const RecordTemplate = ({
  classes,
  onSuccess,
  onError,
  _extends,
  mainnetExplorerUrl = 'https://livenet.flocha.in/api',
  testnetExplorerUrl = 'https://testnet.explorer.mediciland.com/api',
  withPublisher = false
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
    />}
  </div>
}

const styles = theme => ({
  recordTemplateRoot: {
    width: 275
    // marginLeft: 'auto',
    // marginRight: 'auto'
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
      fontSize: 10
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
      cursor: 'pointer'
    }
  },
  removeRowButton: {
    marginLeft: 7,
    border: 0,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  descriptorInputField: {},
  descriptorSelect: {},
  selectOptions: {
    width: 250,
    display: 'flex',
    justifyContent: 'space-between'
  },
  // wallet button
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
  testnetExplorerUrl: PropTypes.string
}

export default withStyles(styles)(RecordTemplate)
