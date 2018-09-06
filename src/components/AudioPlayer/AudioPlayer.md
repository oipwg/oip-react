### Basic Example
An example of how a Audio File renders into AudioPlayer through pulling it from an artifact that was loaded through OIP-Index.

```js
const { Index } = require('oip-index')

const index = new Index()

class AudioPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        index.getArtifact("061951").then((artifact) => {
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
			<AudioPlayer ArtifactFile={this.state.file} />
		)
	}
}
;<AudioPlayerExample />
```

### LockFile Example
If the props of lockFile is passed through and set to true, The Audio will not be accessable to play unless lockFile is set back to false 

```js
const { Index } = require('oip-index')

const index = new Index()
    
class AudioPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
    }
    componentDidMount(){
        index.getArtifact("061951").then((artifact) => {
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
			<AudioPlayer ArtifactFile={this.state.file} lockFile={true} />
		)
	}
}
;<AudioPlayerExample />
```
### Change Example
When the Artifact File is rendered but has multiple within the Artifact (Album, Playlist, etc...) you are able to switch between each one that is displayed by switching out the file that is to be rendered in the state.

```js
const { Index } = require('oip-index')

const index = new Index()

class AudioPlayerExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            file: undefined
        }
        this.onButtonClick = this.onButtonClick.bind(this)
    }
    componentDidMount(){
        index.getArtifact("061951").then((artifact) => {
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
            <button className="btn btn-primary" onClick={() => {                this.onButtonClick(0) }}>Previous Song</button>
            <button className="btn btn-primary" style={{margin: "10px"}}       onClick={() => { this.onButtonClick(1) }}>Next Song</button>
            <AudioPlayer ArtifactFile={this.state.file} />
            </div>
		)
	}
}
;<AudioPlayerExample />
```