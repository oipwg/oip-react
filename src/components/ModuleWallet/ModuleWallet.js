import React, { useState, useRef } from 'react'
import withStyles from 'react-jss'
import { Wallet } from '@oipwg/hdmw'
import styled from 'styled-jss'

import { LoadWallet } from './index'
import WalletHeader from './WalletHeader'
import WalletStateContainer from './WalletStateContainer'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 600px',
    borderRadius: 'inherit',
    backgroundColor: 'white'
  }
})

const Container = styled('div')({
  width: (props) => props.width ? props.width : '779px',
  height: (props) => props.height ? props.height : '339px',
  borderRadius: (props) => props.borderRadius ? props.borderRadius : '10px',
  display: 'flex',
  flexDirection: 'row',
  flexGrow: (props) => props.flexGrow,
  flexShrink: (props) => props.flexShrink || '0',
  flex: (props) => props.flex,
  alignSelf: (props) => props.alignSelf,
  justifySelf: (props) => props.justifySelf,
  border: (props) => props.border,
  boxShadow: (props) => props.boxShadow
})

const ModuleWallet = ({
  classes,
  coins,
  ...rest
}) => {
  const walletRef = useRef(null)
  const [lock, setLock] = useState(true)

  function onMnemonicSubmit (mnemonic) {
    walletRef.current = new Wallet(mnemonic, {
      discover: false,
      supportedCoins: coins
    })
    setLock(false)
  }

  const resetWallet = () => {
    walletRef.current = null
    setLock(true)
  }

  return <Container {...rest}>
    <div className={classes.root}>
      <WalletHeader
        resetWallet={resetWallet}
      />
      {lock ? <LoadWallet
        onMnemonicSubmit={onMnemonicSubmit}
      />
        : <WalletStateContainer
          wallet={walletRef.current}
          coins={coins}
        />}
    </div>
  </Container>
}

export default withStyles(styles)(ModuleWallet)
