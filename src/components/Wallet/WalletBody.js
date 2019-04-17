import React from 'react'
import withStyles from 'react-jss'
import ActionNavBar from './ActionNavBar'
import Addresses from './Addresses'

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

function renderBodyContent ({
  activeNavLink,
  activeCoin,
  wallet,
  coins
}) {
  switch (activeNavLink) {
    case ADDRESSES:
      return <Addresses
        wallet={wallet}
        coin={activeCoin}
        coins={coins}
      />
    default:
      return <Addresses
        wallet={wallet}
        coin={activeCoin}
        coins={coins}
      />
  }
}

const WalletBody = ({
  classes,
  wallet,
  onNavLinkClick,
  navItems,
  activeNavLink,
  activeCoin,
  coins
}) => {
  return <div className={classes.root}>
    <ActionNavBar
      navItems={navItems}
      onNavLinkClick={onNavLinkClick}
      activeNavLink={activeNavLink}
    />
    {renderBodyContent({
      activeNavLink,
      activeCoin,
      wallet,
      coins
    })}
  </div>
}

export default withStyles(styles)(WalletBody)
