import React from 'react'
import withStyles from 'react-jss'
import ActionNavBar from './ActionNavBar'
import WalletPages from './WalletPages'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '9',
    overflow: 'auto'
  }
})

const WalletBody = ({
  classes,
  wallet,
  onNavLinkClick,
  navItems,
  activeNavLink,
  activeCoin,
  coins,
  state,
  handleAddAddress
}) => {
  return <div className={classes.root}>
    <ActionNavBar
      navItems={navItems}
      onNavLinkClick={onNavLinkClick}
      activeNavLink={activeNavLink}
    />
    <WalletPages
      activeCoin={activeCoin}
      wallet={wallet}
      coins={coins}
      activeNavLink={activeNavLink}
      state={state}
      handleAddAddress={handleAddAddress}
    />
  </div>
}

export default withStyles(styles)(WalletBody)
