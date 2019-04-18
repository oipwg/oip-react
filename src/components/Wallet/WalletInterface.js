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
  coins
}) => {
  let defaultCoin
  if (!coins) {
    coins = Object.keys(wallet.getCoins())
    defaultCoin = 'flo'
  } else {
    defaultCoin = coins[0]
  }
  const [activeCoin, setActiveCoin] = useState(defaultCoin)
  const [activeNavLink, setActiveNavLink] = useState(ADDRESSES)

  const handleSetActiveCoin = (coin) => {
    setActiveCoin(coin)
  }

  function handleNavLinkClick (navItem) {
    setActiveNavLink(navItem)
  }

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
