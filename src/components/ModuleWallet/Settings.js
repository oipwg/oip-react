import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    overflowY: 'auto'
  },
  settingsContainer: {
    margin: [10, 20]
  },
  settingsTitle: {
    marginTop: 0,
    marginBottom: 5,
    color: 'grey',
    fontFamily: 'arial'
  }
})

const Settings = ({
  classes,
  coins,
  wallet
}) => {
  return <div className={classes.root}>
    <div className={classes.settingsContainer}>
      <h4 className={classes.settingsTitle} />
    </div>
  </div>
}

export default withStyles(styles)(Settings)
