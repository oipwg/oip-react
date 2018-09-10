import React, { Component } from 'react'
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import './assets/css/ImageViewer.css';
import ArtifactFile from 'oip-index/lib/ArtifactFile';
import { buildIPFSURL, buildIPFSShortURL } from '../../utils.js';
/**
 * The Image Viewer manifests image ArtifactFiles that are passed from the OIP-Index
 */
class ImageViewer extends React.Component {
	constructor(props){
		super(props);

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
		image.crossOrigin = "Anonymous";
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
			if (this.props.onImageLoad) {
				this.props.onImageLoad(image)
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
			<canvas style={{maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto'}} className={classes} ref={canv => {this.canvas = canv}} />
		);
	};
};

ImageViewer.SUPPORTED_FILE_TYPES = ["jpeg", "jpg", "gif", "png", "svg", "bmp", "ico"];
ImageViewer.propTypes = {
	/**
	* The artifact that you wish to display
	*/
	ArtifactFile: PropTypes.object, 
	/** 
	* Lock or Unlock content
	*/
	lockFile: PropTypes.bool,

	//Call back that passes back the imageDOMNode
	/**
	* A optional Callback function that passes up the imageDomNode if asked for
	*/
	onImageLoad: PropTypes.func
};
		
export default ImageViewer;