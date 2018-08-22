import React from 'react'
import videojs from 'video.js'
import PropTypes from 'prop-types';

import { getIPFSURL, getIPFSImage } from '../../utils.js'

import 'video.js/dist/video-js.css'
import './assets/VideoPlayer.css'

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.defaultVideoOptions = {
	        poster: "",
	        sources: [{src: "", type: "video/mp4"}],
	        controls: true,
	        preload: "auto",
	        fluid: true,
	        autoplay: false
        };

		let videoOptions = this.props.options ? {...this.defaultVideoOptions, ...this.props.options} : this.defaultVideoOptions;

        this.state = {
            options: videoOptions,
	        Artifact: undefined,
	        ArtifactFile: undefined
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
	    let options = prevState.options;
	    if (nextProps.ArtifactFile !== prevState.ArtifactFile || nextProps.Artifact !== prevState.Artifact) {
			console.log("Generating url for poster and src using: ", nextProps.ArtifactFile, nextProps.Artifact)
		    options.poster = getIPFSImage(nextProps.Artifact);
		    options.sources[0].src = getIPFSURL(nextProps.Artifact, nextProps.ArtifactFile);

		    //@ToDo: If paid artifact...
		    console.log("generating sources.src in lifecycle method = ", getIPFSURL(nextProps.Artifact, nextProps.ArtifactFile))
	    }
	    return {
	    	options,
		    Artifact: nextProps.Artifact,
		    ArtifactFile: nextProps.ArtifactFile
	    }
    }

    componentDidMount() {
	    // instantiate Video.js
	    this.player = videojs(this.videoNode, this.state.options, function onPlayerReady() {
		    //doSomething
	    });
	    this.setState({player: this.player})

    }

	componentDidUpdate(prevProps, prevState){
    	if (prevState !== this.state) {
		    if (this.player) {
		    	console.log("Sources.src before videojs update: ", this.player.src());
		    	this.player.src(this.state.options.sources);
		    	console.log("Sources.src after videojs update: ", this.player.src());
			    this.player.poster(this.state.options.poster);
			    this.player.autoplay(this.state.options.autoplay);
		    }
	    }
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
    artifact: PropTypes.object,
    artifactFile: PropTypes.object,
    style: PropTypes.object,
    options: PropTypes.object
};

export default VideoPlayer