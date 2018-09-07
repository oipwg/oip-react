import React, {Component} from 'react';
import { connect } from 'react-redux';

import ImageViewer from "./ImageViewer";

class PosterWrapper extends Component {
	render() {
		let artifact_file = this.props.ArtifactFile;
		let posterFile;

		if (!artifact_file && this.props.ActiveReduxFile){
			artifact_file = this.props.ActiveReduxFile.ArtifactFile
		}

		if (artifact_file) {
			let artifact = artifact_file.parent;
			if (artifact.getThumbnail()) {
				posterFile = artifact.getThumbnail()
			}

		}
		return <ImageViewer ArtifactFile={posterFile} onImageLoad={this.props.onImageLoad}/>
	}
}

function mapStateToProps(state){
	return {
		ActiveReduxFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

export default connect(mapStateToProps)(PosterWrapper);