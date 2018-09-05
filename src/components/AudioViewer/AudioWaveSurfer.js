import React, {Component} from 'react';
import { connect } from 'react-redux'
import WaveSurfer from 'wavesurfer.js';
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
// import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js';

import {getFileExtension, getIPFSURL} from "../../utils";

class AudioWaveSurfer extends Component {
	constructor(props) {
		super(props);

		this.state = {

		};

		this.getAudioURL = this.getAudioURL.bind(this);
	}
	
	componentDidMount() {
		this.wavesurfer = WaveSurfer.create({
			container: this.wavesurferNode,
			waveColor: 'white',
			progressColor: '#0F2027',
			responsive: true,
			cursorColor: 'grey',
			// hideScrollbar: true
		});
		// let _this = this;
		this.wavesurfer.on('ready', function () {
			//on ready:
			// _this.wavesurfer.play();
		});
		this.wavesurfer.load(this.getAudioURL());
	}

	getAudioURL(file) {
		let af = file || this.props.ArtifactFile;
		if (af && AudioWaveSurfer.supportedFileTypes.includes(getFileExtension(af))) {
			return getIPFSURL(this.props.ArtifactFile)
		} else {
			console.log(`${af}: unsupported`);
			return undefined
		}
	}

	componentWillUnmount() {
		this.wavesurfer.unAll();
		this.wavesurfer.destroy();
	}

	render() {
		if (this.props.ReduxArtifactFile.isPlaying) {
			this.wavesurfer.play()
		}
		if (this.props.ReduxArtifactFile.isPaused) {
			this.wavesurfer.pause()
		}
		return (
			<div className="wavesurfer" ref={node => this.wavesurferNode = node}/>
		);
	}
}

function mapStateToProps(state) {
	return {
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

AudioWaveSurfer.supportedFileTypes = ['wav', 'mp3', 'ogg']
export default connect(mapStateToProps)(AudioWaveSurfer);