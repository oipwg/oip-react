import React, {Component} from 'react';
import { connect } from 'react-redux'
import WaveSurfer from 'wavesurfer.js';
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
// import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js';
import { setActiveFile, fileToUID } from 'oip-state/src/actions/ActiveArtifactFiles/thunks'

import {getFileExtension, getIPFSURL} from "../../utils";
import {playPauseAudioFile} from "oip-state/src/actions/ActiveArtifactFiles/actions";


class AudioWaveSurfer extends Component {
	constructor(props) {
		super(props);

		this.defaultOptions = {
			waveColor: 'white',
			progressColor: '#0F2027',
			responsive: true,
			cursorColor: 'grey',
			// hideScrollbar: true
		};

		let options = this.props.options ? {...this.defaultOptions, ...this.props.options} : this.defaultOptions;

		this.state = {
			wavesurfer: {
				stop: false,
				play: false,
				pause: false
			},
			options,
			ArtifactFile: undefined,
			ReduxArtifactFile: undefined
		};

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		console.log("get derived state from props");
		let wavesurfer = prevState.wavesurfer, loadArtifactFile = false;
		if (nextProps.ReduxArtifactFile && nextProps.ReduxArtifactFile !== prevState.ReduxArtifactFile) {
			if (prevState.ReduxArtifactFile) {
				wavesurfer.stop = (nextProps.ReduxArtifactFile.ArtifactFile !== prevState.ReduxArtifactFile.ArtifactFile);
			}
			wavesurfer.play = nextProps.ReduxArtifactFile.isPlaying;
			wavesurfer.pause = nextProps.ReduxArtifactFile.isPaused;
		}
		if (nextProps.ArtifactFile !== prevState.ArtifactFile) {
			console.log("New/diff ArtifactFile")
		}

		return {
			wavesurfer,
			loadArtifactFile,
			ArtifactFile: nextProps.ArtifactFile,
			ReduxArtifactFile: nextProps.ReduxArtifactFile
		}
	}

	componentDidMount() {
		console.log("Component did mount")
		this.wavesurfer = WaveSurfer.create({...this.state.options, container: this.wavesurferNode});
		this.loadArtifactFileFromProps();
		this.wavesurfer.load(this.getAudioURL());
	}

	componentDidUpdate(prevProps, prevState){
		console.log("component did update")
		if (prevProps.ReduxArtifactFile !== this.props.ReduxArtifactFile) {
			console.log("change in redux file state")
			let r = this.props.ReduxArtifactFile;
			if (r.isPlaying) {this.wavesurfer.play()}
			if (r.isPaused) {this.wavesurfer.pause()}
		}
		// console.log(JSON.stringify(prevState.wavesurfer, null, 4), JSON.stringify(this.state.wavesurfer, null, 4))
	}

	loadArtifactFileFromProps = () => {
		if (this.props.ArtifactFile && (fileToUID(this.props.ArtifactFile) !== this.props.ActiveFiles.active)) {
			setActiveFile(this.props.ArtifactFile)
		}
	}

	getAudioURL = (file) => {
		let af = file || this.props.ArtifactFile || this.props.ReduxArtifactFile.ArtifactFile;
		if (af && AudioWaveSurfer.supportedFileTypes.includes(getFileExtension(af))) {
			return getIPFSURL(this.props.ArtifactFile)
		} else {
			console.log(`${af}: unsupported`);
			return undefined
		}
	};

	componentWillUnmount() {
		this.wavesurfer.unAll();
		this.wavesurfer.destroy();
	}

	render() {
		return (
			<div className="wavesurfer" ref={node => this.wavesurferNode = node}/>
		);
	}
}

function mapStateToProps(state) {
	return {
		ActiveFiles: state.ActiveArtifactFiles,
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

const mapDispatchToProps = {
	setActiveFile
}

AudioWaveSurfer.supportedFileTypes = ['wav', 'mp3', 'ogg']
export default connect(mapStateToProps, mapDispatchToProps)(AudioWaveSurfer);