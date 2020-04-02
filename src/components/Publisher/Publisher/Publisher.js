import React, { useState } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import WalletButton from '../WalletButton/WalletButton'

const Publisher = ({
  classes,
  getMessage,
  message,
  onSuccess,
  onError,
  mainnetExplorerUrl,
  testnetExplorerUrl
}) => {
  const [wif, setWif] = useState('')
  const [network, setNetwork] = useState('mainnet') // mainnet or testnet

  function handlePrivateKey (e) {
    setWif(e.target.value)
  }

  function handleNetworkChange (e) {
    setNetwork(e.target.value)
  }

  function _getMessage () {
    if (getMessage) {
      try {
        return getMessage({ wif, network })
      } catch (err) {
        throw Error(`Failed to getMessage in Publisher.js: \n ${err}`)
      }
    }
    return undefined
  }

  return <div className={classes.publishContainer}>
    <div className={classes.fieldContainer}>
      <span className={classes.fieldTitle}>Private key (wif)</span>
      <input
        id={'wif'}
        type={'text'}
        onChange={handlePrivateKey}
        value={wif}
        className={classes.inputField}
        placeholder={'private key (wallet import format)'}
      />
    </div>
    <div className={classes.publishRow}>
      <select
        value={network}
        onChange={handleNetworkChange}
        className={classes.networkSelect}>
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
          wif={wif} // KEY
          network={network}
          message={message}
          getMessage={_getMessage}
          onSuccess={onSuccess}
          onError={onError}
          mainnetExplorerUrl={mainnetExplorerUrl}
          testnetExplorerUrl={testnetExplorerUrl}
        />
      </div>
    </div>
  </div>
}

const fieldHeight = 25
const fieldWidth = 250
const marginTopForTitle = 15

const styles = theme => ({
  publishContainer: {
    width: fieldWidth
  },
  fieldContainer: {
    position: 'relative'
  },
  fieldTitle: {
    fontSize: 10,
    color: `${theme.palette.greyscale(0.8)}`,
    position: 'absolute'
  },
  publishRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  networkSelect: {
    height: fieldHeight,
    boxSizing: 'border-box',
    padding: 4,
    background: 'none',
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    fontSize: 12,
    width: 123
  },
  walletButton: {
    '& > button': {
      padding: [4, 8]
    }
  },
  inputField: {
    width: fieldWidth,
    height: fieldHeight,
    boxSizing: 'border-box',
    padding: 4,
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10
    }
  }
})

Publisher.propTypes = {
  classes: PropTypes.object.isRequired,
  getMessage: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  mainnetExplorerUrl: PropTypes.string,
  testnetExplorerUrl: PropTypes.string,
  message: PropTypes.string
}

export default withStyles(styles)(Publisher)
