import React, { useState } from 'react'
import withStyles from 'react-jss'
import { Coins } from './index'
import WalletBody from './WalletBody'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: '11'
  }
})

const ADDRESSES = 'Addresses'
const TRANSACTIONS = 'Transactions'
const SEND = 'Send'
const navigationLinks = [
  ADDRESSES,
  TRANSACTIONS,
  SEND
]

const WalletInterface = ({
  classes,
  wallet,
  coins,
  handleSetActiveCoin,
  activeCoin,
  handleNavLinkClick,
  activeNavLink,
  state,
  refreshCoins,
  handleAddAddress
}) => {
  return <div className={classes.root}>
    <Coins
      wallet={wallet}
      coins={coins}
      setActiveCoin={handleSetActiveCoin}
      activeCoin={activeCoin}
      state={state}
      refreshCoins={refreshCoins}
    />
    <WalletBody
      onNavLinkClick={handleNavLinkClick}
      activeNavLink={activeNavLink}
      navItems={navigationLinks}
      wallet={wallet}
      activeCoin={activeCoin}
      coins={coins}
      state={state}
      handleAddAddress={handleAddAddress}
    />
  </div>
}

export default withStyles(styles)(WalletInterface)
