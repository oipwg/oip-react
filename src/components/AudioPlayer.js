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
        this.react_audio_player.audioEl.pause()
    }
    render() {
		let hash = "";
        let url = "";
        let controls = {}
        console.log(this.props.lockFile)

        if (this.props.Artifact && this.props.ArtifactFile) {
            hash = buildIPFSShortURL(this.props.Artifact.getLocation(), this.props.ArtifactFile.getFilename());
            url = buildIPFSURL(hash);
        }

        if (this.props.lockFile == true){
         return (
             <ReactAudioPlayer 
             ref={(element) => { this.react_audio_player = element; }}
             src={url}
             autoPlay={false}
             controls={true}
             onPlay={this.preventPlay}
             />
         )           
        }   
            
		return (
			<ReactAudioPlayer
            src={url}
            autoPlay={false}
            controls={true} />
		);
	}
}
AudioPlayer.SUPPORTED_FILE_TYPES = ["mp3", "ogg", "wav"];
AudioPlayer.propTypes = {
    Artifact: PropTypes.object,
    ActiveFile: PropTypes.object,
    lockFile: PropTypes.bool
};
export default AudioPlayer;
