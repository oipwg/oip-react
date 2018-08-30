import React, { Component } from 'react'
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import './assets/css/ImageViewer.css'
import ArtifactFile from 'oip-index/lib/ArtifactFile';
import { buildIPFSURL, buildIPFSShortURL } from '../../utils.js';


class ImageViewer extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			image: null
		};
		
		this.drawImageToCanvas = this.drawImageToCanvas.bind(this)
	}

	componentDidMount() {
		this.drawImageToCanvas()
	}

	componentDidUpdate(){
		this.drawImageToCanvas()
	}

	drawImageToCanvas(){
		let hash = "";
		let url = "";

		if (this.props.ArtifactFile) {
			hash = buildIPFSShortURL(this.props.ArtifactFile.parent.getLocation(), this.props.ArtifactFile.getFilename());
			url = buildIPFSURL(hash);
		}

		const image = new window.Image();
		
		image.onload = () => {
			console.log(this.canvas)
			this.canvas.width = this.canvas.parentElement.clientWidth
			// Image Width is set to match the Clients width 
			let width_ratio = this.canvas.parentElement.clientWidth / image.width
			//Scaling of height alined to match set width
			this.canvas.height = image.height * width_ratio;

			let canvas_context = this.canvas.getContext("2d")

			// if (isUnsupportedBrowser())
			// 	this.canvas.style.filter = "blur(30px)"

			if (this.props.lockFile) 
				canvas_context.filter = "blur(30px)"

			canvas_context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)

			console.log("image drawn")
		}

		image.src = url
	}

	// isUnsupportedBrowser(){
	// 	let user_agent = window.navigator.userAgent
	// 	let ie_match_index = user_agent.indexOf("MSIE ")
	// 	let safari_match_index = user_agent.indexOf("Safari ")

	// 	if (ie_match_index !== -1)
	// 		return true

	// 	if (safari_match_index !== -1)
	// 		return true

	// 	return false
	// }
	
	render() {
		return (
			// Get Element By ID
			<canvas ref={canv => {this.canvas = canv}} />
		);
	}
}

ImageViewer.SUPPORTED_FILE_TYPES = ["jpeg", "jpg", "gif", "png", "svg", "bmp", "ico"]
ImageViewer.propTypes = {
	ArtifactFile: PropTypes.object,
	lockFile: PropTypes.bool

};
		
export default ImageViewer;