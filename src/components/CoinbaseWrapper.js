import React, { Component } from 'react';
import { connect } from 'react-redux';

import CoinbaseModal from './CoinbaseModal'

import { handleCoinbaseModalEvents } from "oip-state/src/actions/Payment/thunks";

class CoinbaseWrapper extends Component {
	constructor(props){
		super(props)
	}
	render(){
		let loginText = "Login";

		if (this.props.isLoggedIn){
			if (this.props.Account && this.props.Account._username)
				loginText = this.props.Account._username
			else
				loginText = "Logged In"
		}

		if (this.props.Payment && this.props.Payment.showCoinbaseModal){
			return (
				<CoinbaseModal 
					isOpen={this.props.Payment.showCoinbaseModal}
					currency={this.props.info.currency}
					address={this.props.info.address}
					amount={this.props.info.amount}

					onClose={() => { this.props.handleCoinbaseModalEvents("close") } }
					onCancel={() => { this.props.handleCoinbaseModalEvents("cancel") } }
					onSuccess={() => { this.props.handleCoinbaseModalEvents("success") } }
				/>
			)
		} else {
			return null
		}
	}
}

const mapDispatchToProps = {
	handleCoinbaseModalEvents
}

function mapStateToProps(state) {
	return {
		Payment: state.Payment,
		info: state.Payment.coinbaseInfo
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinbaseWrapper)