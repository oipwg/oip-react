import React, { useState, useEffect } from 'react'
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
  coins = []
}) => {
  const [activeCoin, setActiveCoin] = useState(coins[0] || 'flo')
  const [activeNavLink, setActiveNavLink] = useState(ADDRESSES)

  const handleSetActiveCoin = (coin) => {
    setActiveCoin(coin)
  }

  function handleNavLinkClick (navItem) {
    setActiveNavLink(navItem)
  }

  useEffect(() => {
    //
  }, [activeCoin])
  
  return <div className={classes.root}>
    <Coins
      wallet={wallet}
      coins={coins}
      setActiveCoin={handleSetActiveCoin}
      activeCoin={activeCoin}
    />
    <WalletBody
      onNavLinkClick={handleNavLinkClick}
      activeNavLink={activeNavLink}
      navItems={navigationLinks}
      wallet={wallet}
      activeCoin={activeCoin}
      coins={coins}
    />
  </div>
}

export default withStyles(styles)(WalletInterface)