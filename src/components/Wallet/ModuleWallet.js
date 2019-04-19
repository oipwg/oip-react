import React, { useState, useRef } from 'react'
import withStyles from 'react-jss'
import { Wallet } from 'oip-hdmw'
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

const ModuleWallet = ({
  classes,
  coins
}) => {
  const walletRef = useRef(null)
  const [lock, setLock] = useState(true)

  function onMnemonicSubmit (mnemonic) {
    walletRef.current = new Wallet(mnemonic, {
      discover: false,
      supported_coins: coins
    })
    setLock(false)
  }

  const resetWallet = () => {
    walletRef.current = null
    setLock(true)
  }
  
  return <div className={classes.root}>
    <WalletHeader
      resetWallet={resetWallet}
    />
    {lock ? <LoadWallet
      onMnemonicSubmit={onMnemonicSubmit}
    />
      : <WalletInterface
        resetWallet={resetWallet}
        wallet={walletRef.current}
        coins={coins}
      />}
  </div>
}

export default withStyles(styles)(ModuleWallet)
