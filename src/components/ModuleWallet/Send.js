import React, { useState } from 'react'
import withStyles from 'react-jss'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import classNames from 'classnames'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  sendHeader: {
    display: 'flex',
    flexDirection: 'row',
    flex: '3',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    fontSize: '22px'
  },
  sendBody: {
    display: 'flex',
    flexDirection: 'row',
    flex: '9',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    top: '-33px'
  },
  flexSpacer: {
    display: 'flex',
    flex: '2'
  },
  cycleArrow: {
    display: 'flex',
    flex: '1',
    cursor: 'pointer',
    justifyContent: 'center'
  },
  formContainer: {
    display: 'flex',
    flex: '6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputBase: {
    border: 'none',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    display: 'flex',
    flex: '1',
    height: 40,
    outline: 'none',
    fontSize: 20,
    textAlign: 'center'
  },
  amountInput: {},
  addressInput: {
    fontSize: '15px'
  },
  flodataInput: {
    fontSize: '15px'
  },
  sendSubmit: {
    background: `${theme.palette.primary.main}`,
    color: 'white',
    border: 'none',
    padding: '11px 30px',
    borderRadius: 5,
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      background: 'red'
    }
  }
})

const Send = ({
  classes,
  activeCoin,
  wallet
}) => {
  const needsFloData = activeCoin.includes('flo')

  const cycleStates = ['AMOUNT', 'ADDRESS', 'FLODATA', 'SEND']
  const [displayState, setDisplayState] = useState(0)

  const [amount, setAmount] = useState(0)
  const [address, setAddress] = useState('')
  const [flodata, setFlodata] = useState('')

  function handleAmountChange (e) {
    setAmount(e.target.value)
  }

  function handleAddressChange (e) {
    setAddress(e.target.value)
  }

  function handleFlodataChange (e) {
    setFlodata(e.target.value)
  }

  function handleSubmit () {
    setDisplayState(0)
    setAmount(0)
    setAddress('')
    setFlodata('')

    const options = {
      to: { [address]: amount },
      coin: activeCoin,
      floData: flodata,
      discover: false
    }
    window.alert('sending payment, please wait for confirmation before next transaction')
    wallet.sendPayment(options)
      .then(txid => {
        window.alert(`Transaction successful: ${txid}`)
      })
      .catch(err => {
        window.alert(`Transaction failed: ${err}`)
      })
  }

  function handleOnKeyUp (e) {
    if (e.keyCode === 13) {
      handleCycleRight()
    }
  }

  function renderForm () {
    switch (cycleStates[displayState]) {
      case 'AMOUNT':
        return <input
          className={classNames(classes.inputBase, classes.amountInput)}
          type={'number'}
          value={amount}
          onChange={handleAmountChange}
          onKeyUp={handleOnKeyUp}
        />
      case 'ADDRESS':
        return <input
          className={classNames(classes.inputBase, classes.addressInput)}
          type={'text'}
          value={address}
          placeholder={'oRpmeYvjgfhkSpPWGL8eP5ePupyop3hz9j'}
          onChange={handleAddressChange}
          onKeyUp={handleOnKeyUp}
        />
      case 'FLODATA':
        return <input
          className={classNames(classes.inputBase, classes.flodataInput)}
          type={'text'}
          value={flodata}
          placeholder={'Your text here'}
          onChange={handleFlodataChange}
          onKeyUp={handleOnKeyUp}
        />
      case 'SEND':
        return <input
          type={'submit'}
          value={'Send'}
          onClick={handleSubmit}
          className={classes.sendSubmit}
        />
    }
  }

  function handleCycleLeft () {
    if (displayState === 3 && !needsFloData) {
      setDisplayState(displayState => displayState - 2)
    } else {
      setDisplayState(displayState => displayState - 1)
    }
  }

  function handleCycleRight () {
    if (displayState === 1 && !needsFloData) {
      setDisplayState(displayState => displayState + 2)
    } else {
      setDisplayState(displayState => displayState + 1)
    }
  }

  return <div className={classes.root}>
    <div className={classes.sendHeader}>
      {cycleStates[displayState]}
    </div>
    <div className={classes.sendBody}>
      <div className={classes.flexSpacer} />
      <div className={classes.cycleArrow}>
        {displayState !== 0 ? <KeyboardArrowLeft
          onClick={handleCycleLeft}
        /> : null}
      </div>
      <div className={classes.formContainer}>
        {renderForm()}
      </div>
      <div className={classes.cycleArrow}>
        {displayState !== 3 ? <KeyboardArrowRight
          onClick={handleCycleRight}
        /> : null}
      </div>
      <div className={classes.flexSpacer} />
    </div>
  </div>
}

export default withStyles(styles)(Send)
