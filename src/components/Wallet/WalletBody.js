import React from 'react'
import withStyles from 'react-jss'
import ActionNavBar from './ActionNavBar'
import WalletStateContainer from './WalletStateContainer'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '9'
  }
})

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
    <WalletStateContainer
      activeCoin={activeCoin}
      wallet={wallet}
      coins={coins}
      activeNavLink={activeNavLink}
    />
  </div>
}

export default withStyles(styles)(WalletBody)
