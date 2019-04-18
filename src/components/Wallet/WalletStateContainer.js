import React, { useEffect, useReducer } from 'react'
import withStyles from 'react-jss'
import Addresses from './Addresses'
import Transactions from './Transactions'
import Send from './Send'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '9'
  }
})

const ADDRESSES = 'Addresses'
const TRANSACTIONS = 'Transactions'
const SEND = 'Send'
const ADD_ADDRESSES = 'ADD_ADDRESSES'
const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'

const WalletStateContainer = ({
  classes,
  wallet,
  activeCoin,
  coins,
  activeNavLink
}) => {
  const addresses = activeNavLink === ADDRESSES
  const transactions = activeNavLink === TRANSACTIONS
  const send = activeNavLink === SEND

  function init ({ wallet, coins }) {
    const __coins = coins || Object.keys(wallet.getCoins())
    let stateObj = {}
    for (let coin of __coins) {
      stateObj[coin] = {
        addresses: [],
        transactions: []
      }
    }
    return stateObj
  }

  function addAddresses ({ coin, state, addresses }) {
    return {
      ...state,
      [coin]: {
        ...state[coin],
        addresses: [
          ...state[coin].addresses,
          ...addresses
        ]
      }
    }
  }

  function addTransactions ({ coin, state, transactions }) {
    return {
      ...state,
      [coin]: {
        ...state[coin],
        transactions: [
          ...state[coin].transactions,
          ...transactions
        ]
      }
    }
  }

  function reducer (state, action) {
    switch (action.type) {
      case ADD_ADDRESSES:
        return addAddresses({
          coin: action.coin,
          addresses: action.addresses,
          state
        })
      case ADD_TRANSACTIONS:
        return addTransactions({
          coin: action.coin,
          transactions: action.transactions,
          state
        })
      default:
        throw new Error(`Invalid action type: ${action.type}`)
    }
  }

  const [state, dispatch] = useReducer(reducer, { coins, wallet }, init)

  function getUsedAddresses ({ activeCoin, wallet }) {
    const __COIN = wallet.getCoin(activeCoin)
    const __MAIN_ACCOUNT = __COIN.getAccount(0)
    const usedAddresses = __MAIN_ACCOUNT.getUsedAddresses()

    if (usedAddresses.length > 0) {
      return usedAddresses
    } else {
      return [__MAIN_ACCOUNT.getMainAddress()]
    }
  }
  function setUsedAddresses (usedAddresses) {
    dispatch({
      type: ADD_ADDRESSES,
      coin: activeCoin,
      addresses: usedAddresses
    })
  }
  // onMount/Update
  // when the coin changes and when the nav link changes
  useEffect(() => {
    if (activeNavLink === ADDRESSES) {
      // handle addresses

      // if addresses already in state do nothing
      if (state[activeCoin].addresses.length === 0) {
        const addresses = getUsedAddresses({ activeCoin, wallet })
        setUsedAddresses(addresses)
      }
    }
    async function getTransactions (addresses) {
      const explorer = wallet.getNetworks()[activeCoin].explorer
      let transactions
      try {
        transactions = await explorer.getTransactionsForAddresses(addresses)
      } catch (err) {
        console.error(`Failed to get transactions for coin: ${activeCoin} from explorer: ${err}`)
      }
      console.log(transactions)
      dispatch({
        type: ADD_TRANSACTIONS,
        coin: activeCoin,
        transactions: transactions.items
      })
    }
    if (activeNavLink === TRANSACTIONS) {
      // handle transactions

      // if transactions already in state do nothing
      if (state[activeCoin].transactions.length === 0) {
        if (state[activeCoin].addresses.length === 0) {
          const addresses = getUsedAddresses({ activeCoin, wallet })
          setUsedAddresses(addresses)
          let pubAddresses = []
          for (let addr of addresses) {
            pubAddresses.push(addr.getPublicAddress())
          }
          getTransactions(pubAddresses)
        } else {
          const addresses = state[activeCoin].addresses
          let pubAddresses = []
          for (let addr of addresses) {
            pubAddresses.push(addr.getPublicAddress())
          }
          getTransactions(pubAddresses)
        }
      }
    }
  }, [activeCoin, activeNavLink])

  function handleAddAddress () {
    const addresses = state[activeCoin].addresses
    let index = 0
    for (let address of addresses) {
      if (address.address.index > index) {
        index = address.address.index
      }
    }
    index += 1 // get the address 1 after the index of the highest
    let address = wallet.getCoin(activeCoin).getAccount(0).getAddress(0, index)
    dispatch({
      type: ADD_ADDRESSES,
      coin: activeCoin,
      addresses: [address]
    })
  }

  return <div className={classes.root}>
    {addresses && <Addresses
      addresses={state[activeCoin].addresses}
      addAddress={handleAddAddress}
      explorerUrl={wallet.getExplorerUrls()[activeCoin]}
    />}
    {transactions && <Transactions
      transactions={state[activeCoin].transactions}
      explorerUrl={wallet.getExplorerUrls()[activeCoin]}
      addresses={state[activeCoin].addresses}
    />}
    {/* {send && <Send */}

    {/* />} */}
  </div>
}

export default withStyles(styles)(WalletStateContainer)
