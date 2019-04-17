import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: '15 1 auto'
  }
})

const WalletInterface = ({ classes, wallet, coins, withoutCoins }) => {
  return <div className={classes.root} />
}

export default withStyles(styles)(WalletInterface)
