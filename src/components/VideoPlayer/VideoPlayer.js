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
	    let options = prevState.options;

    	const buildIPFSShortURL = (location, fileName) => {
		    if (!location || !fileName)
			    return "";

		    return location + "/" + fileName;
	    }

	    const buildIPFSURL = (hash, fname) => {
		    let trailURL = "";
		    if (!fname) {
			    let parts = hash.split('/');
			    if (parts.length == 2) {
				    trailURL = parts[0] + "/" + encodeURIComponent(parts[1]);
			    } else {
				    trailURL = hash;
			    }
		    } else {
			    trailURL = hash + "/" + encodeURIComponent(fname);
		    }
		    return "https://gateway.ipfs.io/ipfs/" + trailURL;
	    }

    	if (nextProps.artifact && nextProps.artifactFile && nextProps.artifact.getTXID() !== prevState.txid) {
		    let extension, artifact, artifactFile, thumbnail, src, poster;

		    if (nextProps.artifactFile && nextProps.artifactFile.getFilename()) {
		    	let splitFilename = nextProps.artifactFile.getFilename().split(".")
			    let indexToGrab = splitFilename.length - 1;

		    	extension = splitFilename[indexToGrab].toLowerCase()
		    }

		    if (extension === "mp4") {
		    	artifact = nextProps.artifact;
		    	artifactFile = nextProps.artifactFile;

		    	src = buildIPFSURL(buildIPFSShortURL(artifact.getLocation(), artifactFile.getFilename()))
			    if (artifact.getThumbnail()) {
			    	thumbnail = artifact.getThumbnail()
				    poster = buildIPFSURL(buildIPFSShortURL(artifact.getLocation(), thumbnail.getFilename()))
			    }

			    //@ToDo: If paid artifact, set autoplay to false
		    }
		    let newOptions = {...options, sources: [{src, type: "video/mp4"}], poster}
		    return {
			    txid: nextProps.artifact.getTXID(),
			    options: newOptions
		    }
	    }
    }

    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.state.options, function onPlayerReady() {
            //toSomething
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