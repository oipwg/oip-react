import React, { useEffect, useState } from 'react'
import withStyles from 'react-jss'
import capDecimals from '../../util/capDecimals'
import { Refresh } from '@material-ui/icons'

const styles = theme => ({
  root: {
    display: 'flex',
    flex: '3',
    flexDirection: 'column',
    borderRight: '1px solid grey',
    overflowY: 'auto'
  },
  coinContainer: {
    display: 'flex',
    cursor: 'pointer',
    flex: '0 0 80px',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'column',
    padding: 10,
    borderBottom: '1px solid lightgrey',
    '& #coinTitle': {
      fontWeight: 'bold',
      marginBottom: '2px',
      width: '100%',
      justifyContent: 'space-between',
      color: 'grey',
      '& #refresh-button': {
        '&:hover': {
          color: 'red',
          cursor: 'default'
        },
        '&:active': {
          color: 'blue',
          cursor: 'pointer'
        }
      }
    },
    '& #actionRow': {
      justifyContent: 'flex-end',
      width: '100%'
    }
  },
  balanceContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1'
  },
  coinInfoRow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
})

const Coins = ({
  classes,
  coins,
  wallet,
  setActiveCoin,
  activeCoin
}) => {
  const [coinBalances, setCoinBalances] = useState({})
  const [xRates, setXRates] = useState({})
  const [err, setError] = useState(undefined)
  
  useEffect(() => {
    async function getBalancesAndRates () {
      try {
        setCoinBalances(await wallet.getCoinBalances({ coins, discover: true, testnet: true }))
      } catch (err) {
        setError(err)
      }
      try {
        setXRates(await wallet.getExchangeRates({ coins }))
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
  
  function handleRefresh(e) {
    e.stopPropagation()
    
  }
  
  return <div className={classes.root}>
    {coins.map((coin, i) => {
      const COIN = wallet.getCoin(coin)
      return <div
        key={i}
        className={classes.coinContainer}
        onClick={() => setActiveCoin(coin)}
        style={activeCoinStyle(coin)}
      >
        <div
          className={classes.coinInfoRow}
          id={'coinTitle'}
        >
          {COIN.coin.displayName} wallet
          <span
            id={'refresh-button'}
            onClick={handleRefresh}
          >
            <Refresh />
          </span>
        </div>
        <div
          className={classes.balanceContainer}
        >
          <div className={classes.coinInfoRow}>
            {COIN.coin.ticker}: {coinBalances[coin]}
          </div>
          {coin.includes('testnet') ? null : <div className={classes.coinInfoRow}>
            USD: ${capDecimals((coinBalances[coin] * xRates[coin]), 2)}
          </div>}
        </div>
        {/*<div*/}
        {/*  className={classes.coinInfoRow}*/}
        {/*  id={'actionRow'}*/}
        {/*>*/}
        {/*</div>*/}
      </div>
    })}
  </div>
}

export default withStyles(styles)(Coins)
