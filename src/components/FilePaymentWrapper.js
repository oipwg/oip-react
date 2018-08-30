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
		if (nextProps.ArtifactReduxFile && nextProps.ArtifactReduxFile !== prevState.ArtifactReduxFile) {
			let ps = nextProps.ArtifactReduxFile;
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
			ArtifactReduxFile: nextProps.ArtifactReduxFile
		}
	}

	render() {
		return(
			<div>
				<FileViewer
					ArtifactFile={this.props.ArtifactReduxFile.ArtifactFile}
					lockFile={this.state.lockFile}
					usePosterFile={this.state.usePosterFile}
				/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		state,
		ArtifactReduxFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

const mapDispatchToProps = {

};

FilePaymentWrapper.propTypes = {
	ArtifactFile: PropTypes.object,
	paymentState: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(FilePaymentWrapper);