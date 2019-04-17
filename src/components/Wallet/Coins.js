import React, { useEffect, useState } from 'react'
import withStyles from 'react-jss'
import classNames from 'classnames'

const styles = theme => ({
  root: {
    display: 'flex',
    flex: '4',
    flexDirection: 'column',
    borderRight: '1px solid grey',
    overflowY: 'auto'
  },
  coinContainer: {
    display: 'flex',
    cursor: 'pointer',
    flex: '0 0 50px',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'column',
    padding: 10,
    borderBottom: '1px solid lightgrey'
  },
  coinInfoItem: {
    marginBottom: '3px'
  },
  coinTitle: {
    fontWeight: 'bold'
  },
  coinRateInfo: {}
})

const Coins = ({
  classes,
  coins,
  wallet,
  setActiveCoin,
  activeCoin
}) => {
  if (!coins || coins.length === 0) {
    coins = Object.keys(wallet.getCoins())
  }
  const [coinBalances, setCoinBalances] = useState({})
  const [xRates, setXRates] = useState({})
  const [err, setError] = useState(undefined)
  useEffect(() => {
    async function getBalancesAndRates () {
      try {
        // setCoinBalances(await wallet.getCoinBalances({ coins, discover: true, testnet: true }))
      } catch (err) {
        setError(err)
      }
      try {
        // setXRates(await wallet.getExchangeRates({ coins }))
      } catch (err) {
        setError(err)
      }
    }
    getBalancesAndRates()
  }, [])
  
  const activeCoinStyle = (coin) => {
    if (coin === activeCoin) {
      return {
        borderLeft: '2px solid blue'
      }
    }
  }

  return <div className={classes.root}>
    {coins.map((coin, i) => {
      return <div
        key={i}
        className={classes.coinContainer}
        onClick={() => setActiveCoin(coin)}
        style={activeCoinStyle(coin)}
      >
        <span
          className={classNames(classes.coinInfoItem, classes.coinTitle)}
        >
          {coin} wallet
        </span>
        <span
          className={classNames(classes.coinInfoItem, classes.coinRateInfo)}
        >
          {coinBalances[coin]} {coin} ≈ ${coinBalances[coin] * xRates[coin]}
        </span>
      </div>
    })}
  </div>
}

export default withStyles(styles)(Coins)
