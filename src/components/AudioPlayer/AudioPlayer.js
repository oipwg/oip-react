import React from 'react';
import ReactDOM from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';
import { Index } from 'oip-index';
import PropTypes from 'prop-types';
import { buildIPFSURL, buildIPFSShortURL } from '../../utils.js'
/**
 * The Audio Player allows the implementation of audio ArtifactFiles that are passed from OIP-Index
 */
class AudioPlayer extends React.Component {
    constructor(props){
        super(props)
        this.wait_for_play_promise = false
        this.preventPlay = this.preventPlay.bind(this)
    }
    preventPlay(event){
        // Interval for preventing chrome error of abruptly switching play to pause on the assumption of lockFile 
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
        // Updating of the component if audio becomes locked or unlocked 
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
                controlsList="nodownload"
                controls={true} 
                onPlay={this.preventPlay}
            />
		);
	}
}
AudioPlayer.SUPPORTED_FILE_TYPES = ["mp3", "ogg", "wav"];
AudioPlayer.propTypes = {
    /**
     * An ArtifactFile is passed through a Artifact from the OIP Index by a specific TXID
     * @type {Object}
     */
    ArtifactFile: PropTypes.object,
    lockFile: PropTypes.bool
};
export default AudioPlayer;
