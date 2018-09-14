### Basic Example
How a Video File renders into VideoPlayer 

```js
const { Index } = require('oip-index')

const index = new Index()

class VideoPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        index.getArtifact("21252c").then((artifact) => {
            let files = artifact.getFiles()

            this.setState({
                file: files[0]
            })
        }).catch((e) => {
            // Error
        })
    }
	render() {
		return (
			<VideoPlayer ArtifactFile={this.state.file} />
		)
	}
}
;<VideoPlayerExample />
```

### LockFile Example
Lockfile being set to true will render a video non-playable but the poster or where the video begins will be present

```js
const { Index } = require('oip-index')

const index = new Index()
    
class VideoPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        index.getArtifact("21252c").then((artifact) => {
            let files = artifact.getFiles()

            this.setState({
                file: files[0]
            })
        }).catch((e) => {
            // Error
        })
    }
	render() {
		return (
			<VideoPlayer ArtifactFile={this.state.file} lockFile={true} />
		)
	}
}
;<VideoPlayerExample />
```
### Change Example
When the Artifact is accessed but has multiple files within (Video, Trailer, Poster) you are able to switch by swapping out the file that is to be rendered in the state. In this example, the trailer is being loaded once the Watch Trailer button is clicked.

```js
const { Index } = require('oip-index')

const index = new Index()

class VideoPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }

        this.onButtonClick = this.onButtonClick.bind(this)
    }
    componentDidMount(){
        index.getArtifact("d48f83").then((artifact) => {
            let files = artifact.getFiles()

            this.setState({
                artifact: artifact,
                file: files[0]
            })
        }).catch((e) => { })
    }
    onButtonClick(file_index){
        let files = this.state.artifact.getFiles()

        this.setState({
            file: files[file_index]
        })
    }
	render() {
		return (
            <div>  
                <button className="btn btn-primary" onClick={() => { this.onButtonClick(0) }}>Watch Movie</button>
                <button className="btn btn-primary" style={{marginLeft: "10px"}} onClick={() => { this.onButtonClick(1) }}>Watch Trailer</button>
                <VideoPlayer ArtifactFile={this.state.file} usePosterFile={false} />
            </div>
		)
	}
}
;<VideoPlayerExample />

```
### PosterFile Example
When the Video is loaded, you can either show a Poster as the background image or the beginning of the video

```js
const { Index } = require('oip-index')

const index = new Index()
    
class VideoPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        index.getArtifact("d48f83").then((artifact) => {
            let files = artifact.getFiles()

            this.setState({
                file: files[0]
            })
        }).catch((e) => {
            // Error
        })
    }
	render() {
		return (
			<VideoPlayer ArtifactFile={this.state.file} usePosterFile={true} />
		)
	}
}
;<VideoPlayerExample />
```