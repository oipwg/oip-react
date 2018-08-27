import React from 'react'
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
	        sources: undefined,
	        controls: true,
	        preload: "none",
	        fluid: true,
	        autoplay: false
        };

		let videoOptions = this.props.options ? {...this.defaultVideoOptions, ...this.props.options} : this.defaultVideoOptions;

        this.state = {
	        options: videoOptions,
	        Artifact: undefined,
	        ArtifactFile: undefined,
	        lockFile: undefined,
	        textTrack: [],
	        initialPlay: true,
	        setCaptions: true
        };

        this.loadPlayer = this.loadPlayer.bind(this);
	    this.resetVideo = this.resetVideo.bind(this);

	    this.initialPlay = true
    }

    static getDerivedStateFromProps(nextProps, prevState) {
	    let options = prevState.options, textTrack = [];

	    if (nextProps.ArtifactFile !== prevState.ArtifactFile || nextProps.Artifact !== prevState.Artifact ||
		    nextProps.lockFile !== prevState.lockFile || nextProps.usePosterFile !== prevState.usePosterFile) {

	    	if (nextProps.ArtifactFile && nextProps.Artifact) {
	    		options.preload = "auto";
	    		options.sources = [];
			    if (nextProps.usePosterFile === undefined || nextProps.usePosterFile) {
				    options.poster = getIPFSImage(nextProps.Artifact);
				    options.sources.push({src: getIPFSURL(nextProps.Artifact, nextProps.ArtifactFile), type: "video/mp4"});
			    } else {
				    options.sources.push({src: getIPFSURL(nextProps.Artifact, nextProps.ArtifactFile) + "#t=10", type: "video/mp4"});
				    options.poster = "";
			    }

			    let tmpObj = {};
			    let files = nextProps.Artifact.getFiles();
			    for (let file of files) {
				    let ext = getFileExtension(file);
				    if (ext === 'vtt') {
					    tmpObj["src"] = getIPFSURL(nextProps.Artifact, file);
					    tmpObj["kind"] = "subtitles";
					    tmpObj["srclang"] = "en";
					    tmpObj["label"] = "English";
					    textTrack.push(tmpObj)
				    }
			    }
		    } else {
	    		options = {...options, controls: false, sources: undefined, poster: "", preload: "none", autoplay: false}
		    }
		    options.controls = !nextProps.lockFile;
	    	options.autoplay = !!(prevState.lockFile && !nextProps.lockFile);
	    }
	    // console.log(`Return variables to state --- options: ${JSON.stringify(options, null, 4)} -- textTrack: ${JSON.stringify(textTrack, null, 4)}`);
	    return {
	    	options: options,
		    Artifact: nextProps.Artifact,
		    ArtifactFile: nextProps.ArtifactFile,
		    lockFile: nextProps.lockFile,
		    textTrack: textTrack,
		    usePosterFile: nextProps.usePosterFile
	    }
    }

    componentDidMount() {
	    // instantiate Video.js
	    this.player = videojs(this.videoNode, this.state.options, () => {
		   //do something on player load
	    });
	    this.setState({player: this.player})
	    this.player.on("play", (data) => this.resetVideo(data))
    }

    resetVideo(data) {
    	this.initialPlay = this.state.initialPlay
    	// console.log("Play data: ", data)
	    this.player.play()
		    .then( () => {
		    	if (this.initialPlay) {
				    this.player.currentTime(0)
				    this.initialPlay = false;
				    // this.setState({initialPlay: false}, () => {
				    // 	this.player.currentTime(0)
				    // })
			    }
		    })
		    .catch(err => {console.log(err)})
    	// if (!this.state.initialPlay) {
		//     this.setState({initialPlay: true}, () => {
		// 	    this.player.play()
		// 		    .then( () => {
		// 			    this.player.currentTime(0);
		// 		    })
		// 		    .catch(err => {console.log(err)})
	    //
		//     })
	    // }
    }

    loadPlayer() {
	    if (this.player) {
		    this.player.src(this.state.options.sources);
		    this.player.poster(this.state.options.poster);

		    if (this.state.Artifact && this.state.ArtifactFile) {
			    this.player.autoplay(this.state.options.autoplay);
			    this.player.controls(this.state.options.controls);
			    this.player.preload(this.state.options.preload);

			    let tracks = this.player.textTracks().tracks_
			    for (let tt of tracks) {
			    	this.player.removeRemoteTextTrack(tt)
			    }
			    for (let textTrackObject of this.state.textTrack) {
				    this.player.addRemoteTextTrack(textTrackObject, true)
			    }

		    } else {
			    this.player.reset();
		    	this.player.cache_ = {
		    		duration: null,
				    lastPlaybackRate: 1,
				    lastVolume: 1
			    };
		    	this.player.controls(false)
			    this.player.load()
			    // console.log("Player reset and current source: ", this.player.currentSrc())
		    }
	    }
    }

	componentDidUpdate(prevProps, prevState){
    	if (prevState !== this.state) {
    		this.loadPlayer()
	    }
	}

    // destroy player on unmount @ToDo: Uncomment when not testing in storybook
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
    Artifact: PropTypes.object,
    ArtifactFile: PropTypes.object,
    style: PropTypes.object,
    options: PropTypes.object,
	lockFile: PropTypes.bool,
	usePosterFile: PropTypes.bool
};

export default VideoPlayer