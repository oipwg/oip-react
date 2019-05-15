import React, { useEffect, useState } from 'react'
import { OIP } from 'js-oip'
import withStyles from 'react-jss'
import { isValidWIF } from '../../util'

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
  setMessage
}) => {
  const [disable, toggleDisable] = useState(true)

  useEffect(() => {
    toggleDisable(!isValidWIF(wif, network))
  }, [wif, network])

  async function handleClick (e) {
    e.preventDefault()
    // toDo: set explorerUrl from config

    if (setMessage) {
      message = setMessage()
      console.log(message)
    }

    if (!message || message === '') {
      throw Error(`must pass a message prop of type string to WalletButton`)
    }

    const explorerUrl = network === 'mainnet' ? 'https://flocha.in/api' : 'https://testnet.explorer.mediciland.com/api'
    const wallet = new OIP(wif, network, { explorerUrl }).wallet

    let res
    try {
      res = await wallet.sendDataToChain(message)
    } catch (err) {
      if (onError) onError(err)
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
export default withStyles(styles)(WalletButton)