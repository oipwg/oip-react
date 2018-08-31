import React from 'react';
import PropTypes from 'prop-types';
import FileViewer from './FileViewer'
import {connect} from 'react-redux';

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
		if (nextProps.ArtifactReduxFile && nextProps.ArtifactReduxFile !== prevState.ArtifactReduxFile) {
			let ps = nextProps.ArtifactReduxFile;
			lockFile = !!ps.isPaid;
			if (ps.hasPaid && ps.isPaid) {lockFile = false}
			if (ps.owned) {lockFile = false}
		}
		return {
			lockFile,
			ArtifactReduxFile: nextProps.ArtifactReduxFile
		}
	}

	render() {

		let af;
		if (this.props.ArtifactFile) {
			af = this.props.ArtifactFile
		} else if (this.props.ArtifactReduxFile && this.props.ArtifactReduxFile.ArtifactFile) {
			af = this.props.ArtifactReduxFile.ArtifactFile
		} else {af = undefined}

		return(
			<div>
				<FileViewer
					ArtifactFile={af}
					lockFile={this.state.lockFile}
					{...this.props.options}
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

FilePaymentWrapper.propTypes = {
	ArtifactFile: PropTypes.object,
	options: PropTypes.object
};

export default connect(mapStateToProps)(FilePaymentWrapper);