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
  
  useEffect(() => {
    function setUsedAddresses (usedAddresses) {
      dispatch({
        type: ADD_ADDRESSES,
        coin: activeCoin,
        addresses: usedAddresses
      })
    }
    async function getTransactions (addresses) {
      const explorer = wallet.getNetworks()[activeCoin].explorer
      console.log('addresses to get transactions', addresses)
      let pubAddresses = []
      for (let addr of addresses) {
        pubAddresses.push( addr.getPublicAddress() )
      }
      let transactions
      try {
        transactions = await explorer.getTransactionsForAddresses(pubAddresses)
      } catch (err) {
        console.error(`Failed to get transactions for coin: ${activeCoin} from explorer: ${err}`)
      }
      console.log('trans', transactions)
      dispatch({
        type: ADD_TRANSACTIONS,
        coin: activeCoin,
        transactions: transactions.items
      })
    }
    async function getAddrsAndTxs ({ activeCoin, wallet }) {
      let addrs = []
      if (state[activeCoin].addresses.length === 0) {
        const __COIN = wallet.getCoin(activeCoin)
        const __MAIN_ACCOUNT = __COIN.getAccount(0)

        let account
        try {
          account = await __MAIN_ACCOUNT.discoverChains()
        } catch (err) {
          console.error(`Error discovering chains for account: ${err}`)
        }

        let addresses
        if (account) {
          const usedAddresses = account.getUsedAddresses()
          if (usedAddresses.length > 0) {
            addresses = usedAddresses
          } else {
            addresses = [account.getMainAddress()]
          }
        } else {
          const usedAddresses = __MAIN_ACCOUNT.getUsedAddresses()
          if (usedAddresses.length > 0) {
            addresses = usedAddresses
          } else {
            addresses = [__MAIN_ACCOUNT.getMainAddress()]
          }
        }
        addrs = addresses
        setUsedAddresses(addrs)
      }

      if (state[activeCoin].transactions.length === 0) {
        await getTransactions(addrs)
      }
    }

    getAddrsAndTxs({activeCoin, wallet})
  }, [activeCoin])

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
     {send && <Send
      activeCoin={activeCoin}
      wallet={wallet}
     />}
  </div>
}

export default withStyles(styles)(WalletStateContainer)
