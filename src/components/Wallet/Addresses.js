import React, { useState, useEffect, useReducer } from 'react'
import withStyles from 'react-jss'
import ClipboardJS from 'clipboard'
import classNames from 'classnames'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '10',
    overflowY: 'auto'
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '0 0 30px',
    fontFamily: 'monospace',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: [5, 5],
    cursor: 'copy',
    '& span': {
      margin: [0, 30]
    }
  },
  addAddress: {
    border: '1px solid grey',
    padding: '5px 20px',
    borderRadius: '3px',
    fontSize: '12px',
    marginLeft: '15px',
    cursor: 'pointer'
  },
  addRow: {
    marginTop: '15px'
  }
})

const Addresses = ({
  classes,
  coin,
  wallet,
  coins
}) => {
  new ClipboardJS('.copy-to-clipboard')

  const init = (coins) => {
    let stateObj = {}
    if (coins && coins.length > 0) {
      for (let coin of coins) {
        stateObj[coin] = {}
      }
      return stateObj
    } else {
      return {
        flo: [],
        bitcoin: [],
        litecoin: []
      }
    }
  }

  function addAddress (state) {

  }

  function removeAddress (index, state) {

  }
  function reducer (state, action) {
    switch (action.type) {
      case 'ADD':
        return addAddress(state, action.coin)
      case 'REMOVE':
        return removeAddress(action.index, state)
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = useReducer(reducer, coins, init)
  
  

  const mainAddress = wallet.getCoin(coin).getMainAddress()
  const mainPubAddress = mainAddress.getPublicAddress()

  function onAddressClick (e) {
    let sel = window.getSelection()
    sel.empty()
    window.alert('copied to clipboard')
  }

  return <div className={classes.root}>
    {/*<div*/}
    {/*  className={classNames('copy-to-clipboard ', classes.addressContainer)}*/}
    {/*  onClick={onAddressClick}*/}
    {/*  data-clipboard-target={`#addr-main`}*/}
    {/*>*/}
    {/*  <span>/{mainAddress.address.index}</span>*/}
    {/*  <span id={`addr-main`}>{mainPubAddress}</span>*/}
    {/*</div>*/}
    {/*{[].map((addr, i) => {*/}
    {/*  return <div*/}
    {/*    className={classNames('copy-to-clipboard ', classes.addressContainer)}*/}
    {/*    onClick={onAddressClick}*/}
    {/*    data-clipboard-target={`#addr-${i}`}*/}
    {/*  >*/}
    {/*    <span>/{addr.address.index}</span>*/}
    {/*    <span id={`addr-${i}`}>{addr.getPublicAddress()}</span>*/}
    {/*  </div>*/}
    {/*})}*/}
    {/*<div className={classes.addRow}>*/}
    {/*  <span*/}
    {/*    className={classes.addAddress}*/}
    {/*    onClick={dispatch({ type: 'ADD', coin })}*/}
    {/*  >*/}
    {/*    + Show next address*/}
    {/*  </span>*/}
    {/*</div>*/}
  </div>
}

export default withStyles(styles)(Addresses)
