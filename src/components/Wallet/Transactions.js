import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1'
  },
  txContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1'
  }
})

const Transactions = ({
  classes,
  transactions = [],
  coin = 'flo',
  wallet
}) => {
  return <div className={classes.root}>
    {transactions.map((tx, i) => {
      return <div
        key={i}
        className={classes.txContainer}
      >
        <a className={classes.txLink}>{tx}></a>
      </div>
    })}
  </div>
}

export default withStyles(styles)(Transactions)
