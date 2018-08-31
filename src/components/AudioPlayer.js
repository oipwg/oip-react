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

        this.wait_for_play_promise = false
        
        this.preventPlay = this.preventPlay.bind(this)
    }
    preventPlay(event){
        if (this.props.lockFile){
            if (this.wait_for_play_promise){
                let pause_interval = setInterval(() => {
                    if (!this.wait_for_play_promise){
                        clearInterval(pause_interval)
                        this.react_audio_player.audioEl.pause()
                    }
                }, 50)
            } else {
                this.react_audio_player.audioEl.pause()
            }
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.lockFile && !this.props.lockFile){
            this.wait_for_play_promise = true
            this.react_audio_player.audioEl.play().then(() => {
                this.wait_for_play_promise = false
                console.log("Play Success!")
            }).catch((e) => {
                this.wait_for_play_promise = false
                console.log("Play Error!!!")
            })
        }
        if (!prevProps.lockFile && this.props.lockFile){
            this.react_audio_player.audioEl.pause()
        }     
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
