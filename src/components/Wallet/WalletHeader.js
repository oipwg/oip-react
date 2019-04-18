import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 30px',
    backgroundColor: 'blue',
    borderTopRightRadius: 'inherit',
    borderTopLeftRadius: 'inherit',
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: [0, 10],
    alignItems: 'center',
    color: 'white'
  }
})
const WalletHeader = ({ classes, resetWallet }) => {
  return <div className={classes.root}>
    <h5>hdmw-module</h5>
    <span onClick={resetWallet} style={{ cursor: 'pointer' }}>reset</span>
  </div>
}

export default withStyles(styles)(WalletHeader)
