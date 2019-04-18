import React from 'react'
import withStyles from 'react-jss'
import ClipboardJS from 'clipboard'
import classNames from 'classnames'
import { Link } from '@material-ui/icons'

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
    marginRight: [5, 5],
    '& span': {
      justifyContent: 'center'
    }
  },
  addressIndex: {
    display: 'flex',
    flex: '2'
  },
  pubAddress: {
    display: 'flex',
    flex: '8',
    cursor: 'copy',
    '&:hover': {
      color: 'blue'
    }
  },
  explorerLink: {
    display: 'flex',
    flex: '2',
    cursor: 'pointer',
    '&:hover': {
      color: 'red'
    }
  },
  addAddress: {
    border: '1px solid grey',
    padding: '5px 7px',
    borderRadius: '3px',
    fontSize: '12px',
    marginLeft: '15px',
    cursor: 'pointer'
  },
  addRow: {
    margin: '15px 0px'
  }
})

const Addresses = ({
  classes,
  addAddress,
  addresses,
  explorerUrl
}) => {
  new ClipboardJS('.copy-to-clipboard')
  explorerUrl = explorerUrl.split('api')[0]
  return <div className={classes.root}>
    {addresses.map((addr) => {
      return <div
        key={addr.address.index}
        className={classNames('copy-to-clipboard', classes.addressContainer)}
        data-clipboard-target={`#addr-${addr.address.index}`}
      >
        <span className={classes.addressIndex}>/{addr.address.index}</span>
        <span
          id={`addr-${addr.address.index}`}
          className={classes.pubAddress}
          onClick={() => {
            let sel = window.getSelection()
            sel.empty()
            window.alert('copied to clipboard')
          }}
        >
          {addr.getPublicAddress()}
        </span>
        <span
          className={classes.explorerLink}
          onClick={() => window.open(`${explorerUrl}/address/${addr.getPublicAddress()}`, '_blank')}
        >
          <Link />
        </span>
      </div>
    })}
    {/* give it a split second to load =D */}
    {addresses.length > 0 ? <div className={classes.addRow}>
      <span
        className={classes.addAddress}
        onClick={() => addAddress()}>
        + Show next address
      </span>
    </div> : null }
  </div>
}

export default withStyles(styles)(Addresses)
