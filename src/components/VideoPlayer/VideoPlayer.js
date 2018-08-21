import React from 'react'
// window.VIDEOJS_NO_DYNAMIC_STYLE = true
import videojs from 'video.js'
import PropTypes from 'prop-types';

import 'video.js/dist/video-js.css'
import './assets/VideoPlayer.css'

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.defaultVideoOptions = {
	        poster: "https://gateway.ipfs.io/ipfs/QmQV23t3wUj7rUGVMDq9Qfgv16j75B1yMpJQcsYpgWKCrt/Apocalypse_CA_Poster.jpg",
	        sources: [
		        {
			        src: "https://gateway.ipfs.io/ipfs/QmQV23t3wUj7rUGVMDq9Qfgv16j75B1yMpJQcsYpgWKCrt/Apocalypse_CA.mp4",
			        type: "video/mp4"
		        }
	        ],
	        controls: true,
	        preload: "auto",
	        fluid: true
        };

		let videoOptions = this.props.options ? {...this.defaultVideoOptions, ...this.props.options} : this.defaultVideoOptions;

        this.state = {
            options: videoOptions
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
    	if (nextProps.artifact !== prevState.artifact || nextProps.artifactFile !== prevState.artifactFile) {
			//@ToDo: check extension. if extension === mp4, set prop opts.
	    }

	    return {
    		artifact: nextProps.artifact,
		    artifactFile: nextProps.artifactFile
	    }
    }

    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.state.options, function onPlayerReady() {
            console.log('onPlayerReady', this)
        });
    }

    // // destroy player on unmount @ToDo: Uncomment when not testing in storybook
    // componentWillUnmount() {
    //     if (this.player) {
    //         this.player.dispose()
    //     }
    // }

    render() {
        return (
            <div data-vjs-player className="videojs-container">
                <video ref={node => this.videoNode = node} className="video-js vjs-oip vjs-big-play-centered">
                    <p className="vjs-no-js">
                        To view this video please enable JavaScript, and consider upgrading to a
                        web browser that
                        <a href="http://videojs.com/html5-video-support/" target="_blank">
                            supports HTML5 video
                        </a>
                    </p>
                </video>
            </div>
        )
    }
}

VideoPlayer.SUPPORTED_FILE_TYPES = ["mp4"];
VideoPlayer.propTypes = {
    artifact: PropTypes.object.isRequired,
    artifactFile: PropTypes.object.isRequired,
    style: PropTypes.object,
    options: PropTypes.object
};

export default VideoPlayer