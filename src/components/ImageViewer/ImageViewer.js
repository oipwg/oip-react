import React, { Component } from 'react'
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import './assets/css/ImageViewer.css'
import ArtifactFile from 'oip-index/lib/ArtifactFile';

class ImageViewer extends Component {
	constructor(props){
		super(props)

		this.buildIPFSShortURL = this.buildIPFSShortURL.bind(this);
		this.buildIPFSURL = this.buildIPFSURL.bind(this);
	
	}

	buildIPFSShortURL(location, fileName) {
        if (!location || !fileName)
            return "";

        return location + "/" + fileName;
    }

    buildIPFSURL(hash, fname) {
        let trailURL = "";
        if (!fname) {
            let parts = hash.split('/');
            if (parts.length == 2) {
                trailURL = parts[0] + "/" + encodeURIComponent(parts[1]);
            } else {
                trailURL = hash;
            }
        } else {
            trailURL = hash + "/" + encodeURIComponent(fname);
        }
        return "https://gateway.ipfs.io/ipfs/" + trailURL;
    }
	
	render() {
		let hash = "";
		let url = "";

		if (this.props.artifact && this.props.artifactFile) {
			hash = this.buildIPFSShortURL(this.props.artifact.getLocation(), this.props.artifactFile.getFilename());
			url = this.buildIPFSURL(hash);
		}
		

		return (
			<img className='OIP-ImageViewer' src={url} alt="OIP-ImageViewer" />
		);
	}
}

ImageViewer.SUPPORTED_FILE_TYPES = ["jpeg", "jpg", "gif", "png", "svg", "bmp", "ico"]
ImageViewer.propTypes = {
	artifact: PropTypes.object.isRequired,
	artifactFile: PropTypes.object.isRequired
};
		
export default ImageViewer;