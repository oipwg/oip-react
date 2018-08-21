import React, { Component } from 'react'
import { Index } from 'oip-index';

import './assets/css/ImageViewer.css'

class ImageViewer extends Component {
	constructor(props){
		super(props)
	}
	
	render() {
		return (
			<img className='OIP-ImageViewer' src={'https://ipfs-dev.alexandria.io/ipfs/QmQV23t3wUj7rUGVMDq9Qfgv16j75B1yMpJQcsYpgWKCrt/Apocalypse_CA_Poster.jpg'} alt="Open Index" />
		);
	}
}

// ImageViewer.propTypes = {
//     artifact: PropTypes.object.isRequired,
//     activeFile: PropTypes.object.isRequired,
//     buildIPFSShortURL: PropTypes.func.isRequired,
//     buildIPFSURL: PropTypes.func.isRequired,
// };

export default ImageViewer;