import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1'
  }
})

const Send = ({
  classes,
  coin,
  wallet
}) => {
  return <div className={classes.root}>
  </div>
}

export default withStyles(styles)(Send)
