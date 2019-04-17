import React, { useState, useEffect } from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '10'
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '0 0 50px'
  }
})

const ActionNavBar = ({
  classes,
  coin,
  wallet
}) => {
  const [addresses, setAddresses] = useState([])
  const [activeCoin, setActiveCoin] = useState(coin)
  useEffect(() => {
    setActiveCoin(coin)
  }, [coin])
  useEffect(() => {
    // get addresses
    // set addresses
  }, [activeCoin])
  return <div className={classes.root}>
    {addresses.map((addr, i) => {
      return <div
        className={classes.addressContainer}
        key={i}
      >
        {addr}
      </div>
    })}
  </div>
}

export default withStyles(styles)(ActionNavBar)
