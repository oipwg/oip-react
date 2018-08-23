import React from 'react';
import PropTypes from 'prop-types';
import FileViewer from './FileViewer'

class FilePaymentWrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			lockFile: false,
			paymentState: undefined
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let lockFile = prevState.lockFile;
		if (nextProps.paymentState && nextProps.paymentState !== prevState.paymentState) {
			let ps = nextProps.paymentState;
			lockFile = !!ps.isPaid;
			if (ps.hasPaid && ps.isPaid) {lockFile = false}
			if (ps.owned) {lockFile = false}
		}

		return {
			lockFile,
			paymentState: nextProps.paymentState
		}
	}

	render() {
		return(
			<div>
				<FileViewer Artifact={this.props.Artifact} ArtifactFile={this.props.ArtifactFile} lockFile={this.state.lockFile} />
			</div>
		)
	}
}

FilePaymentWrapper.propTypes = {
	Artifact: PropTypes.object,
	ArtifactFile: PropTypes.object,
	paymentState: PropTypes.object
};

export default FilePaymentWrapper;