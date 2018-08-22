import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux'

import { formatPriceString } from '../utils'

// import {payForArtifactFile} from "../actions/Wallet/thunks";

class PaymentButton extends Component {
	constructor(props){
		super(props);

		this.buyFile = this.buyFile.bind(this);
	}

	buyFile(){
		if (this.props.file.info && this.props.file.info.getSuggestedBuyCost() == 0) {
			console.log("buying file: ", this.props.file.key)
			this.props.buyFile(this.props.file.key)

			if (this.props.file.info.getType() === 'Audio') {
				this.props.isPlayingFile(this.props.file.key, !this.props.file.isPlaying)
			}
			if (!this.props.activeFile) {this.props.setCurrentFile(this.props.artifact, this.props.file)}
			else {if (this.props.file.key !== this.props.activeFile.key) {this.props.setCurrentFile(this.props.artifact, this.props.file)}}
			return
		}

		this.props.payForArtifactFile(this.props.artifact, this.props.file, "buy")
		if (!this.props.activeFile) {this.props.setCurrentFile(this.props.artifact, this.props.file)}
		else {if (this.props.file.key !== this.props.activeFile.key) {this.props.setCurrentFile(this.props.artifact, this.props.file)}}
	}

	render() {
		console.log(this.props);

		let hasPaid = false;
		let owned = false;
		let payInProgress = false;
		let payError = false;

		let disallowPurchase = false;
		let file_cost = 0;

		let button_class = "outline-info";
		let payment_string = "";

		if (this.props.Artifact && this.props.ArtifactFile && this.props.fileState && (this.props.type === "play" || this.props.type === "buy")){
			owned = this.props.fileState.owned;
			hasPaid = this.props.fileState.hasPaid;

			if (this.props.type === "play"){
				if (this.props.fileState.payInProgressPlay)
					payInProgress = true

				if (this.props.fileState.payErrorPlay)
					payError = true

				file_cost = this.props.ArtifactFile.getSuggestedPlayCost();
				disallowPurchase = this.props.ArtifactFile.getDisallowPlay();
			}

			if (this.props.type === "buy"){
				if (this.props.fileState.payInProgressBuy)
					payInProgress = true

				if (this.props.fileState.payErrorBuy)
					payError = true

				file_cost = this.props.ArtifactFile.getSuggestedBuyCost();
				disallowPurchase = this.props.ArtifactFile.getDisallowBuy();
			}
		}

		file_cost = formatPriceString(file_cost);

		if (file_cost === 0 || file_cost === "0"){
			payment_string = "Free";
		} else {
			payment_string = "$" + file_cost;
			button_class = "outline-success";
		}

		if (hasPaid){
			button_class = "outline-info";
			payment_string = "View";
		}

		if (owned) {
			button_class = "primary";

			if (this.props.type === "play")
				payment_string = "View";
			if (this.props.type === "buy")
				payment_string = "Download";
		}

		if (payInProgress) {
			button_class = "outline-info disabled";
			payment_string = "paying...";
		}

		if (payError) {
			button_class = "outline-danger";
			payment_string = "Error!";
		}
		return (
			<div style={{display: disallowPurchase ? "" : "inline-block", paddingLeft: "3px"}}>
				{ disallowPurchase ? "" :
					<button className={"pad-5 btn btn-" + button_class} onClick={() => this.buyFile()} style={this.props.style}>
						<span className="icon icon-download" style={{marginRight: "5px"}}/>{payment_string}
					</button>
				}
			</div>
		)
	}
}

PaymentButton.propTypes = {
	Artifact: PropTypes.object,
	ArtifactFile: PropTypes.object,
	fileState: PropTypes.object,
	type: PropTypes.string,
	style: PropTypes.string
}

function mapStateToProps(state) {
	return { }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentButton)
