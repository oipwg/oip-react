import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { PropagateLoader } from 'react-spinners'

import CoinbaseModal from './CoinbaseModal'

import { handleCoinbaseModalEvents } from "oip-state/src/actions/Payment/thunks";

class CoinbaseWrapper extends Component {
	constructor(props){
		super(props)
	}
	render(){
		return (
			<div>
				{ this.props.Payment.showCoinbaseModal ? 
					<CoinbaseModal 
						isOpen={this.props.Payment.showCoinbaseModal}
						currency={this.props.info.currency}
						address={this.props.info.address}
						amount={this.props.info.amount}

						onClose={() => { this.props.handleCoinbaseModalEvents("close") } }
						onCancel={() => { this.props.handleCoinbaseModalEvents("cancel") } }
						onSuccess={() => { this.props.handleCoinbaseModalEvents("success") } }
					/> 
					: null
				}
				{ this.props.Payment.coinbasePending ? 
					<Modal isOpen={this.props.Payment.coinbasePending} size={"sm"}>
						<ModalBody style={{margin: "auto"}} className="text-center">
							<h5 style={{paddingBottom: "15px"}}>Please wait...</h5>
							<div style={{margin: "auto", width: "1px", paddingRight: "20px"}}>
								<PropagateLoader size={20} />
							</div>
							<p style={{marginTop: "45px", marginBottom: "0px"}}>Waiting for Coinbase to send...</p>
						</ModalBody>
					</Modal> 
					: null
				}
			</div>
		)
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