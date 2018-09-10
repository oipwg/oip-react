import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faCircleNotch, faExclamationCircle, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

import { formatPriceString, getFileExtension } from '../../utils'

import { payForArtifactFile } from "oip-state/src/actions/Payment/thunks";
import { fileToUID } from "oip-state/src/actions/ActiveArtifactFiles/thunks";


class PaymentButton extends Component {
	constructor(props){
		super(props);

		this.payForFile = this.payForFile.bind(this);
	}

	payForFile(event){
		event.stopPropagation();
		this.props.payForArtifactFile(this.props.ArtifactFile, this.props.type)
	}

	render() {
		let fileState, ext, uid;
		ext = getFileExtension(this.props.ArtifactFile);
		uid = fileToUID(this.props.ArtifactFile);
		let isPlaying = this.props.fileIsPlaying && uid === this.props.ActiveArtifactFiles.active
		let viewString;
		switch (ext) {
			case 'mp4':
			case 'mp3':
				if (isPlaying) {
					viewString = 'Pause'
				} else {
					viewString = 'Play';
				}
				break;
			default:
				viewString = 'View';
		}

		if (this.props.ActiveArtifactFiles && this.props.ArtifactFile) {
			let uid = fileToUID(this.props.ArtifactFile);
			fileState = this.props.ActiveArtifactFiles[uid]
		}

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

		if (this.props.ArtifactFile && fileState && (this.props.type === "view" || this.props.type === "buy")){
			owned = fileState.owned;
			hasPaid = fileState.hasPaid;

			if (this.props.type === "view"){
				button_icon = faPlay

				if (fileState.payInProgressView)
					payInProgress = true

				if (fileState.payErrorView)
					payError = true

				file_cost = this.props.ArtifactFile.getSuggestedPlayCost();
				disallowPurchase = this.props.ArtifactFile.getDisallowPlay();
			}

			if (this.props.type === "buy"){
				button_icon = faDownload

				if (fileState.payInProgressBuy)
					payInProgress = true

				if (fileState.payErrorBuy)
					payError = true

				file_cost = this.props.ArtifactFile.getSuggestedBuyCost();
				disallowPurchase = this.props.ArtifactFile.getDisallowBuy();
			}
		}

		file_cost = formatPriceString(file_cost);

		if (file_cost !== 0 && file_cost !== "0"){
			payment_string = "$" + file_cost;
			button_class = "outline-success";
		}

		if (hasPaid && this.props.type !== "buy"){
			button_class = "outline-info";
			payment_string = viewString;
		}

		if (owned || (file_cost === 0 || file_cost === "0")) {
			button_class = "outline-info";

			if (this.props.type === "view")
				button_icon = isPlaying ? faPause : faPlay
				payment_string = viewString;
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

		if (!this.props.ArtifactFile){
			button_class = "outline-warning"
			payment_string = "No ArtifactFile"
		}

		return (
			<div style={{display: disallowPurchase ? "" : "inline-block", paddingLeft: "3px"}}>
				{ disallowPurchase ? "" :
					<button
						className={"pad-5 btn " + `${this.props.size ? `btn-${this.props.size} ` : ""}` +
						"btn-" + button_class + ` ${this.props.className}`}
				        onClick={(e) => this.payForFile(e)}
				        style={this.props.style}>
						<FontAwesomeIcon
							size="xs"
							icon={button_icon}
							className={button_icon_class}
							style={{marginRight: "5px"}} />
						{payment_string}
					</button>
				}
			</div>
		)
	}
}

PaymentButton.propTypes = {
	ArtifactFile: PropTypes.object,
	type: PropTypes.string,
	style: PropTypes.object,
	size: PropTypes.string,
	className: PropTypes.string
};

function mapStateToProps(state) {
	return {
		ActiveArtifactFiles: state.ActiveArtifactFiles,
		fileIsPlaying: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active] ? state.ActiveArtifactFiles[state.ActiveArtifactFiles.active].isPlaying : false,
	}
}

const mapDispatchToProps = {
	payForArtifactFile
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentButton)
