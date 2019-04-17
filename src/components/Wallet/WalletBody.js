import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '8'
  }
})

const WalletBody = ({ classes }) => {
  return <div className={classes.root}>
  
  </div>
}

export default withStyles(styles)(WalletBody)
