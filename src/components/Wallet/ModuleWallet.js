import React, { useState, useEffect, useReducer, useRef } from 'react'
import withStyles from 'react-jss'
import { Wallet } from 'oip-hdmw'
import { validateMnemonic } from 'bip39'

import { LoadWallet, WalletInterface } from './index'
import WalletHeader from './WalletHeader'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 600px',
    borderRadius: 'inherit',
    border: '1px solid grey'
  }
})

const ERROR = {
  INVALID_MNEMONIC: 'INVALID_MNEMONIC'
}

const ModuleWallet = ({
  classes,
  mnemonic,
  coins,
  withoutCoins
}) => {
  const walletRef = useRef(null)
  const [error, setError] = useState(undefined)

  if (mnemonic) {
    if (!validateMnemonic(mnemonic)) {
      setError(ERROR.INVALID_MNEMONIC)
    } else {
      walletRef.current = new Wallet(mnemonic, { discover: false })
    }
  }

  const loadWallet = walletRef.current === null
  console.log(walletRef.current)
  return <div className={classes.root}>
    <WalletHeader />
    {loadWallet ? <LoadWallet
      mnemonic={mnemonic}
      error={error}
    />
      : <WalletInterface
        wallet={walletRef.current}
        coins={coins}
        withoutCoins={withoutCoins}
      />}
  </div>
}

export default withStyles(styles)(ModuleWallet)
