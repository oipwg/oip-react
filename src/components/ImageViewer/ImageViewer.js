import React, { Component } from 'react'
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import './assets/css/ImageViewer.css'
import ArtifactFile from 'oip-index/lib/ArtifactFile';
import { buildIPFSURL, buildIPFSShortURL } from '../../utils.js';
import Blur from 'react-blur';


class ImageViewer extends Component {
	constructor(props){
		super(props)

	}
	

	
	render() {
		let hash = "";
		let url = "";


		if (this.props.Artifact && this.props.ArtifactFile) {
			hash = buildIPFSShortURL(this.props.Artifact.getLocation(), this.props.ArtifactFile.getFilename());
			url = buildIPFSURL(hash);
		}
		
		if (!this.props.Artifact && this.props.ArtifactFile) {
			console.log('Artifact Image was not selected!')
			return 
		}
		
		if (this.props.lockFile === true){
			return(
			<Blur className="OIP-ImageViewer" img={url} blurRadius={50}></Blur>
			)}

		return (
			<Blur className="OIP-ImageViewer" img={url} blurRadius={0}></Blur>
	
			// <img className='OIP-ImageViewer' src={url} alt="OIP-ImageViewer" />
		);
	}
}

ImageViewer.SUPPORTED_FILE_TYPES = ["jpeg", "jpg", "gif", "png", "svg", "bmp", "ico"]
ImageViewer.propTypes = {
	Artifact: PropTypes.object,
	ArtifactFile: PropTypes.object,
	lockFile: PropTypes.bool

};
		
export default ImageViewer;