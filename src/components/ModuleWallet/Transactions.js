import React from 'react'
import withStyles from 'react-jss'
import moment from 'moment'
import capDecimals from '../../util/capDecimals'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '10',
    overflowY: 'auto'
  },
  txContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '0 0 30px',
    fontFamily: 'monospace',
    alignItems: 'center',
    margin: [16, 16],
    fontSize: '11px'
  },
  txBalance: {
    display: 'flex',
    justifyContent: 'center',
    flex: '2',
    margin: [0, 34]
  },
  timeAndTxid: {
    display: 'flex',
    flexDirection: 'column',
    flex: '9',
    justfiyContent: 'center',
    wordBreak: 'break-word'
  },
  blockTime: {
    display: 'flex',
    flex: '3',
    fontWeight: 'bold',
    marginBottom: 3
  },
  txLink: {
    display: 'flex',
    flex: '9',
    cursor: 'pointer',
    '&:hover': {
      color: 'blue'
    }
  }
})

const calculateAmount = (vin, vout, addresses) => {
  let usedPubAddresses = []
  for (let addr of addresses) {
    usedPubAddresses.push(addr.getPublicAddress())
  }
  let vinData = []
  for (let vi of vin) {
    vinData.push({ address: vi.addr, valueSat: vi.valueSat })
  }

  let voutData = []
  for (let vo of vout) {
    const value = vo.value * 1e8 // convert to satoshi
    let addresses = []

    let addressesInVout = vo.scriptPubKey.addresses
    for (let addr of addressesInVout) {
      addresses.push(addr)
    }

    voutData.push({ value, addresses })
  }

  let moneySentFromMe = 0
  for (let vind of vinData) {
    if (usedPubAddresses.includes(vind.address)) {
      moneySentFromMe += Number(vind.valueSat)
    }
  }

  let moneySentToMe = 0
  for (let voutd of voutData) {
    for (let addr of voutd.addresses) {
      if (usedPubAddresses.includes(addr)) {
        moneySentToMe += Number(voutd.value)
      }
    }
  }

  let amount = (moneySentToMe) - (moneySentFromMe)
  amount /= 1e8
  let type = amount > 0 ? 'Received' : 'Sent'
  amount = capDecimals(amount, 8)
  return { amount, type }
}

function sortTransactions(transactions) {
  return transactions.sort((a, b) => {
    return (b.time - a.time)
  })
}
// tx.floData
const Transactions = ({
  classes,
  transactions = [],
  explorerUrl,
  addresses
}) => {
  explorerUrl = explorerUrl.split('api')[0]
  transactions = sortTransactions(transactions)
  return <div className={classes.root}>
    {transactions.map((tx, i) => {
      const { amount } = calculateAmount(tx.vin, tx.vout, addresses)
      return <div
        key={i}
        className={classes.txContainer}
      >
        <div className={classes.timeAndTxid}>
          <span className={classes.blockTime}>{moment.unix(tx.time).format('MMM D, YYYY')}</span>
          <span className={classes.txLink}
            onClick={() => window.open(`${explorerUrl}/tx/${tx.txid}`, '_blank')}
          >{tx.txid}</span>
        </div>
        <div style={{ color: amount >= 0 ? 'green' : 'red' }} className={classes.txBalance}>
          {amount > 0 ? '+' : null }{amount}
        </div>
      </div>
    })}
  </div>
}

export default withStyles(styles)(Transactions)
