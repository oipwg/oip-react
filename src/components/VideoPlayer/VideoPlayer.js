import React from 'react'
import videojs from 'video.js'
import PropTypes from 'prop-types';
import ISO6391 from 'iso-639-1';

import { getIPFSURL, getIPFSImage, getFileExtension } from '../../utils.js'

import 'video.js/dist/video-js.css'
import './assets/VideoPlayer.css'

/**
 * The Video Player manifests Videos that are passed from the OIP-Index
 */

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.defaultVideoOptions = {
	        poster: "",
	        preload: "none",
	        fluid: true,
	        controls: true,
	        autoplay: false,
	        sources: undefined
        };

		let videoOptions = this.props.options ? {...this.defaultVideoOptions, ...this.props.options} : this.defaultVideoOptions;

        this.state = {
	        options: videoOptions,
	        textTracks: [],
	        isPlaying: false,
	        isPaused: false,
	        initialPlay: true,
	        setCaptions: true,
	        artifactFileSwitch: false,
	        lockFile: undefined,
	        ArtifactFile: undefined,
	        usePosterFile: undefined
        };

	    this.initialPlay = true;

	    this.loadPlayer = this.loadPlayer.bind(this);
	    this.resetPlayer = this.resetPlayer.bind(this);
	    this.playerPlaying = this.playerPlaying.bind(this);
	    this.playerPause = this.playerPause.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
	    let options = prevState.options, textTracks = prevState.textTracks, artifactFileSwitch = false;

	    if (nextProps.ArtifactFile) {
	    	//On Artifact or Artifact File Switch or poster switch because it needs most the same logic
		    if (nextProps.ArtifactFile !== prevState.ArtifactFile|| nextProps.usePosterFile !== prevState.usePosterFile) {
		    	//Set controls to true if lockFile is undefined or false, and false if true
			    options.controls = !prevState.lockFile;

			    //if autoplay was set to true by lockfile, we need to turn it back off on ArtifactFile/poster switch so it doesn't play the file automatically
			    options.autoplay = false;
			    //though, if an artifact was playing and just the file was switched, autoplay the file
			    options.autoplay = (nextProps.ArtifactFile !== prevState.ArtifactFile && prevState.isPlaying);

			    //Suggests to the browser whether or not the video data should begin downloading as soon as the <video> element is loaded. 'auto' - 'true' - 'none'
			    options.preload = "auto";

			    //on artifact[file] reload/switch we want to run this.resetPlayer()
			    artifactFileSwitch = true;

			    //Load sources based on whether we're using the poster file or not
			    options.sources = [];
			    if (nextProps.usePosterFile === undefined || nextProps.usePosterFile) {
				    options.poster = getIPFSImage(nextProps.ArtifactFile);
				    options.sources.push({src: getIPFSURL(nextProps.ArtifactFile), type: "video/mp4"});
			    } else {
			    	//if no poster file, load src at 10 seconds (#t=10) to get a frame showing. this.resetPlayer() will make sure video starts from beginning
				    options.sources.push({src: getIPFSURL(nextProps.ArtifactFile) + "#t=10", type: "video/mp4"});
				    options.poster = "";
			    }

			    //Get, strip, and load subtitles (textTracks)
			    textTracks = [];
			    let files = nextProps.ArtifactFile.parent.getFiles();
			    let mainTitle = nextProps.ArtifactFile.parent.getTitle();

			    for (let file of files) {
				    let ext = getFileExtension(file);
				    if (ext === 'vtt') {
					    let tmpObj = {};
					    let fname = file.getFilename();
					    let splitFname = fname.split('.');

					    let length = splitFname.length - 1;
					    let title = splitFname[0];
					    let language = splitFname[length - 1];

					    if (title === mainTitle) {
						    tmpObj["src"] = getIPFSURL(file);
						    tmpObj["srclang"] = language;
						    tmpObj["label"] = ISO6391.getName(language);
						    tmpObj["kind"] = "subtitles";
						    textTracks.push(tmpObj)
					    }
				    }
			    }
		    }
	    } else {
	    	//If the ArtifactFile is undefined set the player to undefined and lock it
		    options = {...options, controls: false, sources: undefined, poster: "", preload: "none", autoplay: false}
	    }

	    //Lock and Unlock the file by changing autoplay and controls to true/false
	    if (nextProps.lockFile !== prevState.lockFile) {
		    options.controls = !nextProps.lockFile;
		    //if the file was paid for, autoplay it
		    if (nextProps.ArtifactFile === prevState.ArtifactFile) {
		    	options.autoplay = !!(prevState.lockFile && !nextProps.lockFile)
		    }
	    }

	    return {
	    	options: options,
		    textTracks: textTracks,
		    artifactFileSwitch: artifactFileSwitch,
		    lockFile: nextProps.lockFile,
		    ArtifactFile: nextProps.ArtifactFile,
		    usePosterFile: nextProps.usePosterFile
	    }
    }

    componentDidMount() {
	    //instantiate Video.js
	    this.player = videojs(this.videoNode, this.state.options, () => {
		   //do something on player load
		    this.loadPlayer();
	    });
	    this.setState({player: this.player});
	    this.player.on("play", () => this.resetPlayer());
	    this.player.on("playing", () => this.playerPlaying());
	    this.player.on("pause", () => this.playerPause());
    }

    playerPlaying() {
	    if (!this.state.isPlaying) {
	    	this.setState({
			    isPlaying: true,
			    isPaused: false
	    	})
	    }
    }

    playerPause() {
	    this.setState({
		    isPaused: true,
		    isPlaying: false
	    })
    }

    //On initial Play, start the video at the beginning
    resetPlayer() {
    	if (this.initialPlay) {
		    this.player.currentTime(0);
		    this.player.play()
			    .then( () => {
				    this.initialPlay = false;
			    })
			    .catch( err => {console.log(err)})
	    }
    }

    loadPlayer() {
	    if (this.player) {
	    	//Doesn't matter if there's an artifact or not to set source and poster. If undefined, set them to undefined
		    this.player.src(this.state.options.sources);
		    this.player.poster(this.state.options.poster);

		    if (this.state.ArtifactFile) {
			    this.player.autoplay(this.state.options.autoplay);
			    this.player.controls(this.state.options.controls);
			    this.player.preload(this.state.options.preload);

			    //on update, remove all textTracks and add back w/e is in state to ensure the most current textTrack files
			    while (this.player.textTracks().tracks_.length > 0){
			    	this.player.removeRemoteTextTrack(this.player.textTracks().tracks_[0])
			    }
			    for (let textTrackObject of this.state.textTracks) {
				    this.player.addRemoteTextTrack(textTrackObject, true)
			    }

		    } else {
		    	//manually reset the cache (resetting the sources) / player.reset() does not reset sources =/
			    this.player.reset();
		    	this.player.cache_ = {
		    		duration: null,
				    lastPlaybackRate: 1,
				    lastVolume: 1
			    };
		    	//make sure this doesn't crash... @ToDo
		    	this.player.controls(this.state.options.controls);
		    	//Re-loads the audio/video element
			    this.player.load()
		    }
	    }
    }

	componentDidUpdate(prevProps, prevState){
    	//checks for new player options and updates the player
    	if (prevState.options !== this.state.options || prevState.textTracks !== this.state.textTracks ||  prevState.lockFile !== this.state.lockFile) {
    		this.loadPlayer();
	    }
	    //If there was an artifact/file switch, we need to set the initialPlay back to true so resetPlayer() can run
	    if (this.state.artifactFileSwitch) {
	    	this.initialPlay = true
	    }
	}

    // // destroy player on unmount @ToDo: Breaks in storybook... cannot remove child node
    // componentWillUnmount() {
    //     if (this.player) {
	//         this.player.off("play", () => this.resetPlayer());
	//         this.player.off("playing", () => this.playerPlaying());
	//         this.player.off("pause", () => this.playerPause());
    //         this.player.dispose()
    //     }
    // }

    render() {
        return (
            <div data-vjs-player className="videojs-container">
                <video onContextMenu={(e) => {e.preventDefault()}} ref={node => this.videoNode = node} className="video-js vjs-oip vjs-big-play-centered">
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
	/**
	* The artifact that you wish to display
	*/
	ArtifactFile: PropTypes.object,
	/**
	 * Parameters that can be utilized
	 * @param {string} Poster A URL to an image that displays before the video begins playing. This is often a frame of the video or a custom title screen. As soon as the user hits "play" the image will go away.
	 * 
	 * @param {string} Preload Suggests to the browser whether or not the video data should begin downloading as soon as the video element is loaded. Supported values are: 'auto', 'metadata', and 'none'
	 * 
	 * @param {boolean} fluid When true, the Video.js player will have a fluid size. In other words, it will scale to fit its container. Also, if the video element has the "vjs-fluid", this option is automatically set to true.
	 * @param {boolean} controls Determines whether or not the player has controls that the user can interact with. Without controls the only way to start the video playing is with the autoplay attribute or through the Player API.  
	 * @param {boolean} autoplay When true, videojs will autoplay and when false will not autoplay. autoplay is also a string that the values of 'muted', 'play', and 'any' can be passed through. [Strings](https://docs.videojs.com/tutorial-options.html#autoplay)
	 * @param {Array} sources  An array of objects that mirror the native video element's capability to have a series of child source elements. This should be an array of objects with the src and type properties.
	 */
	options: PropTypes.object,
	/**
	 * Lock or Unlock content
	 */
	lockFile: PropTypes.bool,
	/**
	 * Choice of showing a poster before playing a video
	 */
	usePosterFile: PropTypes.bool
};

export default VideoPlayer