import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import ColorThief from 'color-thief'
import { PlayButton, PauseButton } from 'react-player-controls'

import { playPauseAudioFile } from 'oip-state/src/actions/ActiveArtifactFiles/actions'
import { fileToUID } from 'oip-state/src/actions/ActiveArtifactFiles/thunks'

import {getIPFSURL} from "../../utils";
import AudioWaveSurfer from './AudioWaveSurfer';
import PosterWrapper from '../ImageViewer/PosterWrapper'
import './assets/styles/AudioViewer.scss'

class AudioViewer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colorOne: '#fff',
			colorTwo: '#000',
			colorThree: '#000',
			paletteGenerated: false
		};

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let paletteGenerated = prevState.paletteGenerated
		if (nextProps.ArtifactFile !== prevState.ArtifactFile) {
			paletteGenerated = false
		}
		return {
			paletteGenerated,
			ArtifactFile: nextProps.ArtifactFile
		}
	}

	playPause = (uid, bool) => {
		this.props.playPauseAudioFile(uid, bool)
	}

	generateColorPalette = (imageNode) => {
		if (!this.state.paletteGenerated) {
			console.log("Color Thieving")
			let colorThief = new ColorThief();
			let palette = colorThief.getPalette(imageNode, 2);
			this.setState({colorOne: palette[0]})
			this.setState({colorTwo: palette[1]})
			this.setState({colorThree: palette[2]})
			this.setState({paletteGenerated: true})
		}
	};

	render() {
		let file = this.props.ArtifactFile || this.props.ReduxArtifactFile;
		let url, artist, title;
		if (file) {
			url = getIPFSURL(file);
			artist = file.parent.getDetail('artist');
			title = file.getFilename();
		} else {
			artist = "unknown";
			title = "unknown";
		}

		//@ToDO: add redux variables for play state
		let isPlaying = this.props.ReduxArtifactFile.isPlaying;
		const playbackButton = isPlaying ? (
			<PauseButton
				isEnabled={true}
				onClick={() => this.playPause(fileToUID(file), false)}
			/>) : (
			<PlayButton
				isEnabled={true}
				onClick={() => this.playPause(fileToUID(file), true)}
			/>);


		return (
			<div className="audio-viewer-container" style={{position: 'relative', height: '380px', overflow: 'hidden'}}>
				<div style={{height: '100%'}}>
					<div className={"background-gradient"} style={{height: "100%", position: 'relative', zIndex: '0',
						backgroundImage: `linear-gradient(-90deg, rgb(${this.state.colorOne.toString()}), rgb(${this.state.colorTwo.toString()}))`}}/>
				</div>
				<div className={"border-box"} style={{position: 'absolute', top: '0', left: '0', right: '0', width: '100%', height: '100%', boxSizing: 'border-box', zIndex: '10',
					padding: '30px 560px 20px 30px'
				}}>
					<div className={"album-art"} style={{position: 'absolute', top: '20px', right: '20px', zIndex: '1', width: '340px', height: '340px'}}>
						<PosterWrapper ArtifactFile={file} onImageLoad={this.generateColorPalette}/>
					</div>
					<div className={"album-title"}>
						<div className={"hyphenate"} style={{overflowWrap: "break-word", wordWrap: 'break-word'}}>
							<div className={"title-container d-flex"}>
								<div className={"playback-button"} style={{height: '60px', width: '60px', marginRight: '10px'}}>
									{playbackButton}
								</div>
								<div className={"track-info"} style={{flex: '1', minWidth: '0px'}}>
									<div className={"artist-info mr-0"} style={{marginBottom: '7px'}}>
										<span style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '4px', color: '#f2f2f2'}}>{artist}</span>
									</div>
									<span style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '8px 7px 7px', fontSize: '22px', color: 'white', lineHeight: '36px'}}>{title}</span>
								</div>
								<div className={"soundbar"}
								     style={{position: 'absolute', bottom: '0', 'left': '30px', right: '390px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
									<div className={"waveform_"} style={{marginBottom: '30px', height: '100px', zIndex: '1'}}>
										<div className={"waveform_wrapper"} style={{position: 'relative', 'width': '100%', height: '100%'}}>
											<div className={"waveform_wrapper_loaded"} style={{position: 'absolute', left: '0', top: '0', right: '0', bottom: '0'}}>
												<AudioWaveSurfer ArtifactFile={file}/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

const mapDispatchToProps = {
	playPauseAudioFile
}

AudioViewer.propTypes = {
	ArtifactFile: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioViewer);