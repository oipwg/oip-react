import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faDownload, faCircleNotch, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

import { formatPriceString } from '../utils'

import { payForArtifactFile } from "oip-state/src/actions/Payment/thunks";

class PaymentButton extends Component {
	constructor(props){
		super(props);

		this.payForFile = this.payForFile.bind(this);
	}

	payForFile(){
		this.props.payForArtifactFile(this.props.Artifact, this.props.ArtifactFile, this.props.type)
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
		let button_icon
		let button_icon_class = ""

		if (this.props.Artifact && this.props.ArtifactFile && this.props.fileState && (this.props.type === "play" || this.props.type === "buy")){
			owned = this.props.fileState.owned;
			hasPaid = this.props.fileState.hasPaid;

			if (this.props.type === "play"){
				button_icon = faPlay

				if (this.props.fileState.payInProgressPlay)
					payInProgress = true

				if (this.props.fileState.payErrorPlay)
					payError = true

				file_cost = this.props.ArtifactFile.getSuggestedPlayCost();
				disallowPurchase = this.props.ArtifactFile.getDisallowPlay();
			}

			if (this.props.type === "buy"){
				button_icon = faDownload

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

		if (hasPaid && this.props.type !== "buy"){
			button_class = "outline-info";
			payment_string = "View";
		}

		if (owned) {
			button_class = "outline-info";

			if (this.props.type === "play")
				payment_string = "View";
			if (this.props.type === "buy")
				payment_string = "Download";
		}

		if (payInProgress) {
			button_class = "outline-info disabled";
			payment_string = "paying...";

			button_icon = faCircleNotch
			button_icon_class = "fa-spin"
		}

		if (payError) {
			button_class = "outline-danger";
			payment_string = "Error";

			button_icon = faExclamationCircle
		}

		if (!this.props.Artifact || !this.props.ArtifactFile){
			button_class = "outline-warning"
			payment_string = "No Artifact/File"
		}

		return (
			<div style={{display: disallowPurchase ? "" : "inline-block", paddingLeft: "3px"}}>
				{ disallowPurchase ? "" :
					<button className={"pad-5 btn btn-" + button_class} onClick={() => this.payForFile()} style={this.props.style}>
						<FontAwesomeIcon icon={button_icon} className={button_icon_class} style={{marginRight: "5px"}} />{payment_string}
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

const mapDispatchToProps = {
	payForArtifactFile
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentButton)
