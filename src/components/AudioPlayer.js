import React from 'react';
import ReactDOM from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import ArtifactFile from 'oip-index/lib/ArtifactFile';
import { buildIPFSURL, buildIPFSShortURL } from './../utils.js'

class AudioPlayer extends React.Component {
    constructor(props){
		super(props)

	
    }
    render() {
		let hash = "";
		let url = "";
            if (this.props.Artifact && this.props.ArtifactFile) {
                hash = buildIPFSShortURL(this.props.Artifact.getLocation(), this.props.ArtifactFile.getFilename());
                url = buildIPFSURL(hash);
            }
        console.log(url)
		return (
			<ReactAudioPlayer
            src={url}
            autoPlay
            controls />
		);
	}
}
AudioPlayer.SUPPORTED_FILE_TYPES = ["mp3", "ogg", "wav"];
AudioPlayer.propTypes = {
    Artifact: PropTypes.object,
    ActiveFile: PropTypes.object
};
export default AudioPlayer;
