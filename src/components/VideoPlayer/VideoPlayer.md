### Basic Example
An example of how a Video File renders into VideoPlayer through pulling it from an artifact that was loaded by OIP-Index.

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
When an Video File is suppossed to be paid for, Video Player will lock it and render it non-playable. Autoplays once payment has been verified.

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
When the Artifact File is rendered but has multiple within the Artifact (Video, Trailer, Poster) you are able to switch between each one that is manifested by switching out the file that is to be rendered in the state. In this example, the trailer is being loaded.

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
                file: files[1]
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