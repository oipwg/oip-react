import React, { Component } from 'react'
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import './assets/css/ImageViewer.css';
import ArtifactFile from 'oip-index/lib/ArtifactFile';
import { buildIPFSURL, buildIPFSShortURL } from '../../utils.js';

/**
 * This shows how images render from the OIP Index and how they can be utilized
 */
class ImageViewer extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			image: null
		};
		
		this.drawImageToCanvas = this.drawImageToCanvas.bind(this)
		this.isUnsupportedBrowser = this.isUnsupportedBrowser.bind(this)
	};

	componentDidMount() {
		this.drawImageToCanvas()
	};

	componentDidUpdate(){
		this.drawImageToCanvas()
	};

	drawImageToCanvas(){
		let hash = ""
		let url = ""

		if (this.props.ArtifactFile) {
			// Creation of IPFS hash of artifact Image
			hash = buildIPFSShortURL(this.props.ArtifactFile.parent.getLocation(), this.props.ArtifactFile.getFilename());
			url = buildIPFSURL(hash)
		};

		const image = new window.Image();
		image.onload = () => {
			this.canvas.width = this.canvas.parentElement.clientWidth
			let width_ratio = this.canvas.parentElement.clientWidth / image.width
			this.canvas.height = image.height * width_ratio;
			let canvas_context = this.canvas.getContext("2d")
		
			if (this.isUnsupportedBrowser())
				this.canvas.style.filter = "blur(30px)"

			if (this.props.lockFile)
				canvas_context.filter = "blur(30px)"

			canvas_context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)

			if (this.props.ArtifactFile === undefined){
				canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				url = ""
			}
		}
		// setting of hash to render on image canvas
		image.src = url
	}
	isUnsupportedBrowser(){
		// Functionality for 2D render canvas unsupported browsers
		let user_agent = window.navigator.userAgent
		let ie_match_index = user_agent.indexOf("MSIE ")
		let safari_match_index = user_agent.indexOf("Safari ")
		if (ie_match_index !== -1)
			return true

		if (safari_match_index !== -1)
			return true
					
		return false
	};
	
	render() {
		let classes;

		if (this.props.lockFile)
			classes = "OIP-Blur"
		// CSS in addition to Canvas Blur, Blur will apply regardless of Browser

		return (
			// Get Element By ID
			<canvas className={classes} ref={canv => {this.canvas = canv}} />
		);
	};
};

ImageViewer.SUPPORTED_FILE_TYPES = ["jpeg", "jpg", "gif", "png", "svg", "bmp", "ico"]
ImageViewer.propTypes = {
	/**
	 * An ArtifactFile is passed through a Artifact from the OIP Index by a specific TXID
	 * @type {Object} 
	 */
	ArtifactFile: PropTypes.object,
	 
	lockFile: PropTypes.bool
};
		
export default ImageViewer;