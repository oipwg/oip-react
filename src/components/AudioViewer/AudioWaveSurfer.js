import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import WaveSurfer from 'wavesurfer.js';
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
// import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js';
import { playFile, pauseFile } from 'oip-state/src/actions/ActiveArtifactFiles/actions'
import { setActiveFile, fileToUID } from 'oip-state/src/actions/ActiveArtifactFiles/thunks'

import {getFileExtension, getIPFSURL} from "../../utils";

class AudioWaveSurfer extends Component {
	constructor(props) {
		super(props);

		//default wavesurfer options. can find more options at wavesurfer-js.org/
		this.defaultOptions = {
			waveColor: 'white',
			progressColor: '#0F2027',
			responsive: true,
			cursorColor: 'grey',
			// hideScrollbar: true
		};
		//user can pass down option props to override and extend default props
		let options = this.props.options ? {...this.defaultOptions, ...this.props.options} : this.defaultOptions;

		this.state = {
			wavesurfer: {
				stop: false,
				play: false,
				pause: false
			},
			options,
			ArtifactFile: undefined,
			ReduxArtifactFile: undefined,
		};

		this.initialLoad = true;

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// console.log("(1) get derived state from props");
		let wavesurfer = prevState.wavesurfer;
		//wavesurfer.stop identifies whether or not the active file has been switched
		wavesurfer.stop = false;
		if (nextProps.ReduxArtifactFile && nextProps.ReduxArtifactFile !== prevState.ReduxArtifactFile) {
			// console.log("(2) New redux file")
			// console.log("(2.1) Check redux artifact files: ", JSON.stringify(nextProps.ReduxArtifactFile, null, 4), JSON.stringify(prevState.ReduxArtifactFile, null, 4))

			//want to prevent running this on initial load
			if (prevState.ReduxArtifactFile) {
				// console.log("(3) Setting wavesurfer.stop to : ", nextProps.ReduxArtifactFile.ArtifactFile !== prevState.ReduxArtifactFile.ArtifactFile)
				// console.log("(3.1) Check redux artifact files: ", JSON.stringify(nextProps.ReduxArtifactFile.ArtifactFile, null, 4), JSON.stringify(prevState.ReduxArtifactFile.ArtifactFile, null, 4))

				//stop and reset the player if the active file has switched
				wavesurfer.stop = (nextProps.ReduxArtifactFile.ArtifactFile !== prevState.ReduxArtifactFile.ArtifactFile);
			}
			//play and/or pause based on the redux store. the playback controls set the play state and the wavesurfer listens for updated and plays/pauses accordingly
			wavesurfer.play = nextProps.ReduxArtifactFile.isPlaying;
			wavesurfer.pause = nextProps.ReduxArtifactFile.isPaused;
		}
		//again, don't want to run this on initial load because there's no ArtifactFile in state initially
		if (prevState.ArtifactFile && nextProps.ArtifactFile !== prevState.ArtifactFile) {
			// console.log("(4) New/diff ArtifactFile; setting stop to true")

			//stop and reload player on Artifact File switch
			wavesurfer.stop = true;
		}

		return {
			wavesurfer,
			ArtifactFile: nextProps.ArtifactFile,
			ReduxArtifactFile: nextProps.ReduxArtifactFile,
		}
	}

	componentDidMount() {
		// console.log("(5) Component did mount");

		this.wavesurfer = WaveSurfer.create({...this.state.options, container: this.wavesurferNode});
		this.wavesurfer.on('ready', () => {
			// console.log("Wavesurfer ready event")
			if (!this.state.ReduxArtifactFile.isPaid || (this.state.ReduxArtifactFile.isPaid && (this.state.ReduxArtifactFile.hasPaid || this.state.ReduxArtifactFile.owned))) {
				if (this.initialLoad) {
					this.initialLoad = false;
				} else {
					this.props.playFile(fileToUID(this.state.ReduxArtifactFile.ArtifactFile))
				}
			}
			// console.log("(6) Wavesurfer is now ready")
		});
		//this function checks to see if there's an artifact passed to props and sets it to active. does nothing if no prop
		this.loadArtifactFileFromProps();
		//load the surfer with the audio url
		this.wavesurfer.load(this.getAudioURL());
	}

	componentDidUpdate(prevProps, prevState){
		// console.log("(7) component did update")

		if (prevProps.ReduxArtifactFile !== this.props.ReduxArtifactFile) {
			// console.log("(8) change in redux file state")

			//this block of code loads the surfer with a file if the previous state was undefined
			if (this.props.ReduxArtifactFile && this.props.ReduxArtifactFile.ArtifactFile) {
				if (prevProps.ReduxArtifactFile === undefined) {
					this.loadArtifactFileFromProps();
					this.wavesurfer.stop();
					this.wavesurfer.load(this.getAudioURL());
				}
			}

			let redux_file = this.props.ReduxArtifactFile;

			//play/pause wavesurfer based on redux state that was set to local state by getDerived
			if (redux_file && redux_file.isPlaying) {
				this.wavesurfer.play()
				this.isPlaying = true;
			}
			if (redux_file && redux_file.isPaused) {
				this.wavesurfer.pause()
				this.isPlaying = false
			}
		}
		//on artifact file switch
		if (this.state.wavesurfer.stop) {
			//if there was an artifact switch, either in the store or via props, set it to active it if from props, stop, reset, and load it's url

			// console.log("(9) Load the new artifact from stop")

			this.loadArtifactFileFromProps();
			this.wavesurfer.stop();
			this.wavesurfer.load(this.getAudioURL());
		}
	}

	//this function sets an artifact file passed down via props to 'active' in the redux store
	loadArtifactFileFromProps = () => {
		// console.log("(10) load artifact from props")

		if (this.props.ArtifactFile && (fileToUID(this.props.ArtifactFile) !== this.props.ActiveFileUID)) {
			// console.log("(11) setting load artifact to state redux")

			this.props.setActiveFile(this.props.ArtifactFile)
		}
	}

	//self-explanatory title. if an artifact file was passed down via props, it'll use that over the one in the store. (by the prop will be set to store anyway via loadArtifactFileFromProps()
	getAudioURL = (file) => {
		let artifact_file;

		if (file) {
			artifact_file = file
		} else if (this.props.ArtifactFile) {
			artifact_file = this.props.ArtifactFile
		} else if (this.props.ReduxArtifactFile) {
			artifact_file = this.props.ReduxArtifactFile.ArtifactFile
		} else {
			artifact_file = undefined
		}

		if (artifact_file && AudioWaveSurfer.supportedFileTypes.includes(getFileExtension(artifact_file))) {
			return getIPFSURL(artifact_file)
		} else {
			console.log(`${artifact_file}: unsupported`);
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
		ActiveFileUID: state.ActiveArtifactFiles.active,
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

const mapDispatchToProps = {
	setActiveFile,
	playFile,
	pauseFile
}

AudioWaveSurfer.supportedFileTypes = ['wav', 'mp3', 'ogg'];
AudioWaveSurfer.propTypes = {
	options: PropTypes.object,
	ArtifactFile: PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(AudioWaveSurfer);