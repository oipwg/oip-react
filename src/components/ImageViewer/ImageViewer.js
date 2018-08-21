import React, { Component } from 'react'
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import './assets/css/ImageViewer.css'

class ImageViewer extends Component {
	constructor(props){
		super(props)
		
	
	}
	
	render() {
		let hash = "https://gateway.ipfs.io/ipfs/QmQV23t3wUj7rUGVMDq9Qfgv16j75B1yMpJQcsYpgWKCrt/Apocalypse_CA_Poster.jpg";

		// if (this.props.activeFile && ((this.props.activeFile.isPaid && !this.props.activeFile.hasPaid) && !this.props.activeFile.owned)){
		// 	hash = this.props.buildIPFSShortURL(this.props.artifact.getLocation(), this.props.activeFile.info.getFilename());
		// } else {
		// 	if (this.props.artifact && this.props.activeFile){
		// 		hash = this.props.buildIPFSShortURL(this.props.artifact.getLocation(), this.props.activeFile.info.getFilename());
		// 	}
		// }
		return (
			<img className='OIP-ImageViewer' src={hash} alt="Open Index" />
		);
	}
}

export default ImageViewer;