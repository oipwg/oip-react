import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 30px',
    backgroundColor: 'blue',
    borderRadius: 'inherit',
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: [0, 10],
    alignItems: 'center',
    color: 'white'
  }
})
const WalletHeader = ({ classes }) => {
  return <div className={classes.root}>
    <h5>hdmw-module</h5>
    <span>toggle</span>
  </div>
}

export default withStyles(styles)(WalletHeader)
