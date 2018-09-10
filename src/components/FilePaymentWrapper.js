import React from 'react';
import PropTypes from 'prop-types';
import FileViewer from './FileViewer/FileViewer.js'
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
		if (nextProps.ReduxArtifactFile && nextProps.ReduxArtifactFile !== prevState.ReduxArtifactFile) {
			let fileState = nextProps.ReduxArtifactFile;
			lockFile = !!fileState.isPaid;
			if (fileState.hasPaid && fileState.isPaid) {lockFile = false}
			if (fileState.owned) {lockFile = false}
		}
		return {
			lockFile,
			ReduxArtifactFile: nextProps.ReduxArtifactFile
		}
	}

	render() {

		let ArtifactFile;
		if (this.props.ArtifactFile) {
			ArtifactFile = this.props.ArtifactFile
		} else if (this.props.ReduxArtifactFile && this.props.ReduxArtifactFile.ArtifactFile) {
			ArtifactFile = this.props.ReduxArtifactFile.ArtifactFile
		} else {ArtifactFile = undefined}

		return(
			<div>
				<FileViewer
					ArtifactFile={ArtifactFile}
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
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

FilePaymentWrapper.propTypes = {
	ArtifactFile: PropTypes.object,
	options: PropTypes.object
};

export default connect(mapStateToProps)(FilePaymentWrapper);