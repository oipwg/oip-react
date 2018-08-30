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
        
        this.preventPlay = this.preventPlay.bind(this)
    }
    preventPlay(event){
        if (this.props.lockFile)
            this.react_audio_player.audioEl.pause()
    }

    componentDidUpdate(prevProps){
        if (prevProps.lockFile && !this.props.lockFile)
            this.react_audio_player.audioEl.play()
    }

    render() {
		let hash = "";
        let url = "";

        if (this.props.ArtifactFile) {
            hash = buildIPFSShortURL(this.props.ArtifactFile.parent.getLocation(), this.props.ArtifactFile.getFilename());
            url = buildIPFSURL(hash);
        }

		return (
			<ReactAudioPlayer
                ref={(element) => { this.react_audio_player = element; }}
                src={url}
                autoPlay={false}
                controls={true} 
                onPlay={this.preventPlay}
            />
		);
	}
}
AudioPlayer.SUPPORTED_FILE_TYPES = ["mp3", "ogg", "wav"];
AudioPlayer.propTypes = {
    ActiveFile: PropTypes.object,
    lockFile: PropTypes.bool
};
export default AudioPlayer;
