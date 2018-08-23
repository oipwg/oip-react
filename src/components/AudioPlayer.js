import React from 'react';
import ReactDOM from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import ArtifactFile from 'oip-index/lib/ArtifactFile';

class AudioPlayer extends React.Component {
    constructor(props){
		super(props)

	
    }
    render() {
		let hash = "";
		let url = "";

		if (this.props.Artifact && this.props.ArtifactFile) {
            url = this.props.ArtifactFile
        }

		return (
			<ReactAudioPlayer
            src={url}
            controls />
		);
	}
}
AudioPlayer.SUPPORTED_FILE_TYPES = ["mp3", "ogg", "wav"];
AudioPlayer.propTypes = {
    artifact: PropTypes.object,
    activeFile: PropTypes.object,
    volumeControls: PropTypes.object,
    filePlaylist: PropTypes.object,
    active: PropTypes.string,
    updateFileCurrentTime: PropTypes.func,
    isPlayableFile: PropTypes.func,
    isSeekableFile: PropTypes.func,
    updateFileDuration: PropTypes.func,
    setVolume: PropTypes.func,
    setMute: PropTypes.func,
    playlistNext: PropTypes.func,
    isPlayingFile: PropTypes.func,
    setCurrentFile: PropTypes.func,
    buildIPFSShortURL: PropTypes.func,
    buildIPFSURL: PropTypes.func,
    buyInProgress: PropTypes.func,
    buyError: PropTypes.func,
    paymentError: PropTypes.func,
    paymentInProgress: PropTypes.func,
    payForFile: PropTypes.func,
    buyFile: PropTypes.func
};
export default AudioPlayer;
