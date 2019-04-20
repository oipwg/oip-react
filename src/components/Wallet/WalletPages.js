import React, { useEffect, useReducer } from 'react'
import withStyles from 'react-jss'
import Addresses from './Addresses'
import Transactions from './Transactions'
import Send from './Send'
import WalletInterface from './WalletInterface'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '9'
  }
})

const ADDRESSES = 'Addresses'
const TRANSACTIONS = 'Transactions'
const SEND = 'Send'


const WalletPages = ({
  classes,
  wallet,
  activeCoin,
  activeNavLink,
  state,
  handleAddAddress
}) => {
  const addresses = activeNavLink === ADDRESSES
  const transactions = activeNavLink === TRANSACTIONS
  const send = activeNavLink === SEND
  

  return <div className={classes.root}>
    {addresses && <Addresses
      addresses={state[activeCoin].addresses}
      addAddress={handleAddAddress}
      explorerUrl={wallet.getExplorerUrls()[activeCoin]}
    />}
    {transactions && <Transactions
      transactions={state[activeCoin].transactions}
      explorerUrl={wallet.getExplorerUrls()[activeCoin]}
      addresses={state[activeCoin].addresses}
    />}
     {send && <Send
      activeCoin={activeCoin}
      wallet={wallet}
     />}
  </div>
}

export default withStyles(styles)(WalletPages)
