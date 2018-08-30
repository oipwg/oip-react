import React from 'react';
import PropTypes from 'prop-types';
import FileViewer from './FileViewer'
import {connect} from 'react-redux';

class FilePaymentWrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			lockFile: false,
			usePosterFile: undefined,
			paymentState: undefined
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let lockFile = prevState.lockFile, usePosterFile = prevState.usePosterFile;
		if (nextProps.paymentState && nextProps.paymentState !== prevState.paymentState) {
			let ps = nextProps.paymentState;
			lockFile = !!ps.isPaid;
			if (ps.hasPaid && ps.isPaid) {lockFile = false}
			if (ps.owned) {lockFile = false}
		}

		if (nextProps.usePosterFile !== undefined) {
			usePosterFile = nextProps.usePosterFile
		}

		return {
			usePosterFile,
			lockFile,
			paymentState: nextProps.paymentState
		}
	}

	render() {
		return(
			<div>
				<FileViewer
					ArtifactFile={this.props.ArtifactFile}
					lockFile={this.state.lockFile}
					usePosterFile={this.state.usePosterFile}
				/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		state
	}
}

const mapDispatchToProps = {

}

FilePaymentWrapper.propTypes = {
	ArtifactFile: PropTypes.object,
	paymentState: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(FilePaymentWrapper);