import React, { useEffect, useState } from 'react'
import { OIP } from 'js-oip'
import withStyles from 'react-jss'
import PropTypes from 'prop-types'
import { isValidWIF } from '../../../util'

const styles = theme => ({
  walletButtonRoot: {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    padding: [7, 12],
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    '&:disabled': {
      color: 'grey',
      borderColor: 'grey',
      backgroundColor: 'white',
      fontWeight: '400',
      cursor: 'default'
    }
  }
})
const WalletButton = ({
  classes,
  text = 'Submit',
  wif = '',
  network = 'mainnet',
  message,
  onSuccess,
  onError,
  getMessage,
  mainnetExplorerUrl = 'https://livenet.flocha.in/api',
  testnetExplorerUrl = 'https://testnet.explorer.mediciland.com/api'
}) => {
  const [disable, toggleDisable] = useState(true)

  useEffect(() => {
    toggleDisable(!isValidWIF(wif, network))
  }, [wif, network])

  async function handleClick (e) {
    e.preventDefault()

    let originalMessage = message
    if (getMessage) {
      try {
        message = getMessage()
      } catch (err) {
        if (onError) {
          return onError(err)
        } else {
          throw Error(`Failed to get getMessage in wallet button component \n ${err}`)
        }
      }
      if (!message) { // if message is undefined, then set to the original message
        message = originalMessage
      }
    }

    if (!message || message === '') {
      if (onError) {
        return onError(`must pass a message prop of type string to WalletButton`)
      } else {
        throw Error(`must pass a message prop of type string to WalletButton \n`)
      }
    }

    const explorerUrl = network === 'mainnet' ? mainnetExplorerUrl : testnetExplorerUrl
    const oip = new OIP(wif, network, { explorerUrl })
    const wallet = oip.wallet

    let res
    if (message.length > 1040) {
      try {
        res = await oip.publishMultiparts(message)
      } catch (err) {
        if (onError) onError(err)
      }
    } else {
      try {
        res = await wallet.sendDataToChain(message)
      } catch (err) {
        if (onError) onError(err)
      }
    }

    if (onSuccess) onSuccess(res)
  }

  return <button
    disabled={disable}
    className={classes.walletButtonRoot}
    onClick={handleClick}
  >
    {text}
  </button>
}

WalletButton.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string,
  wif: PropTypes.string,
  network: PropTypes.string,
  message: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  getMessage: PropTypes.func,
  mainnetExplorerUrl: PropTypes.string,
  testnetExplorerUrl: PropTypes.string
}

export default withStyles(styles)(WalletButton)