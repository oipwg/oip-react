import React, { useState, useEffect } from 'react'
import withStyles from 'react-jss'
import { Coins } from './index'
import WalletBody from './WalletBody'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: '11'
  }
})

const WalletInterface = ({
  classes,
  wallet,
  coins = []
}) => {
  const [activeCoin, setActiveCoin] = useState(coins[0])

  const handleSetActiveCoin = (coin) => {
    setActiveCoin(coin)
  }

  useEffect(() => {
    //
  }, [activeCoin])
  
  return <div className={classes.root}>
    <Coins
      wallet={wallet}
      coins={coins}
      setActiveCoin={handleSetActiveCoin}
      activeCoin={activeCoin}
    />
    <WalletBody />
  </div>
}

export default withStyles(styles)(WalletInterface)
