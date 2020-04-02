import React, { useEffect, useReducer, useState } from 'react'
import WalletInterface from './WalletInterface'

const ADDRESSES = 'Addresses'

const ADD_ADDRESSES = 'ADD_ADDRESSES'
const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
const UPDATE_BALANCE = 'UPDATE_BALANCE'
const UPDATE_EXCHANGE_RATE = 'UPDATE_EXCHANGE_RATE'

const WalletStateContainer = ({
  wallet,
  coins
}) => {
  let defaultCoin
  if (!coins) {
    coins = Object.keys(wallet.getCoins())
    defaultCoin = 'flo'
  } else {
    defaultCoin = coins[0]
  }
  const [activeCoin, setActiveCoin] = useState(defaultCoin)
  const [activeNavLink, setActiveNavLink] = useState(ADDRESSES)

  function handleSetActiveCoin (coin) {
    setActiveCoin(coin)
  }

  function handleNavLinkClick (navItem) {
    setActiveNavLink(navItem)
  }

  function init ({ wallet, coins }) {
    const __coins = coins || Object.keys(wallet.getCoins())
    let stateObj = {}
    for (let coin of __coins) {
      stateObj[coin] = {
        addresses: [],
        transactions: [],
        balance: undefined,
        exchangeRate: undefined
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
      case UPDATE_BALANCE:
        return {
          ...state,
          [action.coin]: {
            ...state[action.coin],
            balance: action.balance
          }
        }
      case UPDATE_EXCHANGE_RATE:
        return {
          ...state,
          [action.coin]: {
            ...state[action.coin],
            exchangeRate: action.exchangeRate
          }
        }
      default:
        throw new Error(`Invalid action type: ${action.type}`)
    }
  }

  const [state, dispatch] = useReducer(reducer, { coins, wallet }, init)

  async function discoverCoins (coins) {
    if (typeof coins === 'string') {
      coins = [coins]
    }
    for (let coin of coins) {
      await wallet.getCoin(coin).discoverAccounts()
    }
  }

  async function getExchangeRates (coins) {
    if (typeof coins === 'string') {
      coins = [coins]
    }
    try {
      return await wallet.getExchangeRates({ coins }) // returns object {flo: xr, bitcoin: xr}
    } catch (err) {
      console.error(`Failed to get exchange rates: ${err}`)
      return {}
    }
  }

  function setExchangeRates (exchangeRates) {
    let keys = Object.keys(exchangeRates)
    for (let coin of keys) {
      dispatch({
        type: UPDATE_EXCHANGE_RATE,
        coin,
        exchangeRate: exchangeRates[coin]
      })
    }
  }

  async function getCoinBalances (coins) {
    if (typeof coins === 'string') {
      coins = [coins]
    }
    let options = {
      coins,
      testnet: true,
      discover: false
    }
    try {
      return await wallet.getCoinBalances(options) // returns object {flo: bal, bitcoin: bal}
    } catch (err) {
      console.error(`Failed to get coin balances: ${err}`)
      return {}
    }
  }

  function setCoinBalances (coinBalances) {
    let keys = Object.keys(coinBalances)
    for (let coin of keys) {
      dispatch({
        type: UPDATE_BALANCE,
        coin,
        balance: coinBalances[coin]
      })
    }
  }

  function setUsedAddresses (usedAddresses, coin) {
    dispatch({
      type: ADD_ADDRESSES,
      coin,
      addresses: usedAddresses
    })
  }

  function getUsedAddresses (coins) {
    if (typeof coins === 'string') {
      coins = [coins]
    }
    let addressObject = {}
    for (let coin of coins) {
      const __COIN = wallet.getCoin(coin)
      const __ACOUNT = __COIN.getAccount(0)
      let usedAddresses = __ACOUNT.getUsedAddresses()
      if (usedAddresses.length > 0) {
        addressObject[coin] = usedAddresses
      } else {
        addressObject[coin] = [__ACOUNT.getMainAddress()]
      }
    }
    return addressObject // return {flo: [addrs], bitcoin: [addrs] }
  }

  function setTransactions (transactions, coin) {
    dispatch({
      type: ADD_TRANSACTIONS,
      coin,
      transactions: transactions
    })
  }

  async function getTransactions (coins, addressObject) {
    if (typeof coins === 'string') {
      coins = [coins]
    }
    let transactionObject = {}
    for (let coin of coins) {
      const explorer = wallet.getNetworks()[coin].explorer

      let pubAddresses = []
      for (let addr of addressObject[coin]) {
        pubAddresses.push(addr.getPublicAddress())
      }
      let transactions
      try {
        transactions = await explorer.getTransactionsForAddresses(pubAddresses)
      } catch (err) {
        console.error(`Failed to get transactions for coin: ${activeCoin} from explorer: ${err}`)
      }
      transactionObject[coin] = transactions.items
    }
    return transactionObject // return {flo: [txs], bitcoin: [txs] }
  }

  function updateAddresses (addressObject) {
    for (let coin in addressObject) {
      if (addressObject.hasOwnProperty(coin)) {
        let addressesToAddToState = []
        const currentAddresses = state[coin].addresses
        for (let newAddress of addressObject[coin]) {
          let match = false
          for (let oldAddress of currentAddresses) {
            if (oldAddress.address.index === newAddress.address.index) {
              match = true
            }
          }
          if (!match) {
            addressesToAddToState.push(newAddress)
          }
        }
        setUsedAddresses(addressesToAddToState, coin)
      }
    }
  }

  function updateTransactions (transactionObject) {
    for (let coin in transactionObject) {
      if (transactionObject.hasOwnProperty(coin)) {
        let transactionsToAddToState = []
        const currentTransactions = state[coin].transactions
        for (let newTransaction of transactionObject[coin]) {
          let match = false
          for (let oldTransaction of currentTransactions) {
            if (oldTransaction.txid === newTransaction.txid) {
              match = true
            }
          }
          if (!match) {
            transactionsToAddToState.push(newTransaction)
          }
        }
        setTransactions(transactionsToAddToState, coin)
      }
    }
  }

  async function updateCoinStates (coins) {
    // discover
    // get exchange rate
    // set exchange rate
    // get balance
    // set balance
    // get used addresses
    // update used addresses
    // get transactions
    // update transactions
    await discoverCoins(coins)
    const exchangeRates = await getExchangeRates(coins)
    setExchangeRates(exchangeRates)
    const balances = await getCoinBalances(coins)
    setCoinBalances(balances)
    const addressObject = getUsedAddresses(coins)
    updateAddresses(addressObject)
    const transactionObject = await getTransactions(coins, addressObject)
    updateTransactions(transactionObject)
  }

  useEffect(() => {
    // for each coin, discover accounts
    // get exchange rates
    // set exchange rates
    // get balances
    // set balances
    // get used addresses
    // set used addresses
    // get transactions
    // set transactions
    async function superFunction () {
      await discoverCoins(coins)
      const exchangeRates = await getExchangeRates(coins)
      setExchangeRates(exchangeRates)
      const balances = await getCoinBalances(coins)
      setCoinBalances(balances)
      const addressObject = getUsedAddresses(coins)
      for (let coin in addressObject) {
        if (addressObject.hasOwnProperty(coin)) {
          setUsedAddresses(addressObject[coin], coin)
        }
      }
      const transactionObject = await getTransactions(coins, addressObject)
      for (let coin in transactionObject) {
        if (transactionObject.hasOwnProperty(coin)) {
          setTransactions(transactionObject[coin], coin)
        }
      }
    }

    superFunction()
  }, [])

  return <WalletInterface
    wallet={wallet}
    coins={coins}
    activeCoin={activeCoin}
    setActiveCoin={setActiveCoin}
    activeNavLink={activeNavLink}
    handleSetActiveCoin={handleSetActiveCoin}
    handleNavLinkClick={handleNavLinkClick}
    handleAddAddress={handleAddAddress}
    state={state}
    refreshCoins={updateCoinStates}
  />
}

export default WalletStateContainer
