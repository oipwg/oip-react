import React from 'react'
import {Artifact as ArtifactClass, ArtifactFile as ArtifactFileClass} from 'oip-index'
import videojs from 'video.js'
import PropTypes from 'prop-types';

import { getIPFSURL, getIPFSImage, getFileExtension } from '../../utils.js'

import 'video.js/dist/video-js.css'
import './assets/VideoPlayer.css'

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.defaultVideoOptions = {
	        poster: "",
	        sources: [
		        {
			        src: "",
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
	    // console.log("getDerivedStateFromProps", nextProps, prevState)
	    let options = prevState.options, poster, url;

	    if (nextProps.ArtifactFile && nextProps.Artifact && nextProps.Artifact instanceof ArtifactClass && nextProps.ArtifactFile instanceof ArtifactFileClass) {
		    if (nextProps.ArtifactFile !== prevState.ArtifactFile || nextProps.Artifact !== prevState.ArtifactFile) {
			    if (nextProps.Artifact.getLocation() && nextProps.ArtifactFile.getFilename()) {

				    let extension = getFileExtension(nextProps.ArtifactFile);
				    if (extension === "mp4") {
					    poster = getIPFSImage(nextProps.Artifact);
					    url = getIPFSURL(nextProps.Artifact, nextProps.ArtifactFile);
					    options = {...options, sources: [{src: url, type: "video/mp4"}], poster};
					    //@ToDo: If paid artifact...
				    }
				    return {
					    options,
					    Artifact: nextProps.Artifact,
					    ArtifactFile: nextProps.ArtifactFile
				    }
			    }
		    }
	    }
	    return {}
    }

    componentDidMount() {
	    // instantiate Video.js
	    this.player = videojs(this.videoNode, this.state.options, function onPlayerReady() {
		    //doSomething
	    });

    }

	componentDidUpdate(prevProps, prevState){
    	if (prevState !== this.state) {
		    if (this.player) {
		    	console.log("Video.js ", this.player)
			    let opts = this.player.options_;

			    if (opts.post !== this.state.options.poster) {
				    this.player.poster(this.state.options.poster)
			    }

			    if (opts.sources !== this.state.options.sources) {
				    this.player.src(this.state.options.sources)
			    }
			    if (opts.autoplay !== this.state.options.autoplay) {
				    this.player.autoplay(this.state.options.autoplay)
			    }
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