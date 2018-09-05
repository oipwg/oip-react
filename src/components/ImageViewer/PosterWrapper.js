import React, {Component} from 'react';
import ImageViewer from "./ImageViewer";

class PosterWrapper extends Component {
	render() {
		let af = this.props.ArtifactFile;
		let posterFile;
		if (af) {
			let artifact = af.parent;
			if (artifact.getThumbnail()) {
				posterFile = artifact.getThumbnail()
			}

		}
		return <ImageViewer ArtifactFile={posterFile} onImageLoad={this.props.onImageLoad}/>
	}
}

export default PosterWrapper;